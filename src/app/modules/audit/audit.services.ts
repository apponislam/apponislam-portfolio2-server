import { Types } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { AuditLogModel } from "./audit.model";
import { IAuditLog, AuditAction, AuditResource, AuditStatus } from "./audit.interface";

// Create audit log
const createAuditLog = async (auditData: Partial<IAuditLog>): Promise<IAuditLog> => {
    const log = new AuditLogModel(auditData);
    return await log.save();
};

// Create audit log with change tracking
const logAction = async (
    userId: string,
    action: AuditAction,
    resource: AuditResource,
    ipAddress: string,
    options?: {
        resourceId?: string;
        oldData?: Record<string, any>;
        newData?: Record<string, any>;
        status?: AuditStatus;
        statusCode?: number;
        errorMessage?: string;
        userAgent?: string;
        metadata?: Record<string, any>;
    },
): Promise<IAuditLog> => {
    const changes = generateChanges(options?.oldData, options?.newData);

    const auditData: Partial<IAuditLog> = {
        userId: new Types.ObjectId(userId),
        action,
        resource,
        resourceId: options?.resourceId,
        oldData: options?.oldData,
        newData: options?.newData,
        changes,
        status: options?.status || "SUCCESS",
        statusCode: options?.statusCode,
        errorMessage: options?.errorMessage,
        ipAddress,
        userAgent: options?.userAgent,
        metadata: options?.metadata,
    };

    return await createAuditLog(auditData);
};

// Generate changes array from old and new data
const generateChanges = (oldData?: Record<string, any>, newData?: Record<string, any>) => {
    if (!oldData || !newData) return undefined;

    const changes = [];
    const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);

    for (const key of allKeys) {
        const oldValue = oldData?.[key];
        const newValue = newData?.[key];

        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            changes.push({
                field: key,
                oldValue,
                newValue,
            });
        }
    }

    return changes.length > 0 ? changes : undefined;
};

// Get all audit logs with filtering
const getAllAuditLogs = async (query: any) => {
    const { page = 1, limit = 20, userId, action, resource, status, resourceId, ipAddress, startDate, endDate, sortBy = "createdAt", sortOrder = "desc" } = query;

    const filter: any = {};

    // Apply filters
    if (userId) filter.userId = new Types.ObjectId(userId);
    if (action) filter.action = action;
    if (resource) filter.resource = resource;
    if (status) filter.status = status;
    if (resourceId) filter.resourceId = resourceId;
    if (ipAddress) filter.ipAddress = ipAddress;

    // Date range filter
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const logs = await AuditLogModel.find(filter).populate("userId", "fullName email").sort(sortOptions).skip(skip).limit(parseInt(limit));

    // Get total count
    const total = await AuditLogModel.countDocuments(filter);

    return {
        logs,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    };
};

// Get single audit log
const getAuditLogById = async (id: string): Promise<IAuditLog | null> => {
    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid audit log ID");
    }

    const log = await AuditLogModel.findById(id).populate("userId", "fullName email");

    if (!log) {
        throw new ApiError(httpStatus.NOT_FOUND, "Audit log not found");
    }

    return log;
};

// Get user activity
const getUserActivity = async (userId: string, options?: { limit?: number; days?: number }) => {
    const limit = options?.limit || 50;
    const days = options?.days || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await AuditLogModel.find({
        userId: new Types.ObjectId(userId),
        createdAt: { $gte: startDate },
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("userId", "fullName email");

    return activities;
};

// Get audit statistics
const getAuditStatistics = async () => {
    const [totalLogs, successLogs, failedLogs, actionStats, resourceStats, topUsers, recentLogs] = await Promise.all([
        AuditLogModel.countDocuments(),
        AuditLogModel.countDocuments({ status: "SUCCESS" }),
        AuditLogModel.countDocuments({ status: "FAILED" }),
        AuditLogModel.aggregate([{ $group: { _id: "$action", count: { $sum: 1 } } }]),
        AuditLogModel.aggregate([{ $group: { _id: "$resource", count: { $sum: 1 } } }]),
        AuditLogModel.aggregate([{ $group: { _id: "$userId", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }, { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } }]),
        AuditLogModel.find().sort({ createdAt: -1 }).limit(20).populate("userId", "fullName email"),
    ]);

    return {
        total: totalLogs,
        successCount: successLogs,
        failedCount: failedLogs,
        successRate: totalLogs > 0 ? ((successLogs / totalLogs) * 100).toFixed(2) + "%" : "0%",
        actionStats: actionStats.reduce((acc, stat) => ({ ...acc, [stat._id]: stat.count }), {}),
        resourceStats: resourceStats.reduce((acc, stat) => ({ ...acc, [stat._id]: stat.count }), {}),
        topUsers: topUsers.map((user) => ({
            userId: user._id,
            userName: user.user?.[0]?.fullName || "Unknown",
            actionCount: user.count,
        })),
        recentLogs: recentLogs,
    };
};

// Get failed attempts for security monitoring
const getFailedAttempts = async (options?: { userId?: string; hours?: number }) => {
    const hours = options?.hours || 24;
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);

    const filter: any = {
        status: "FAILED",
        createdAt: { $gte: startDate },
    };

    if (options?.userId) {
        filter.userId = new Types.ObjectId(options.userId);
    }

    const failedAttempts = await AuditLogModel.find(filter).sort({ createdAt: -1 }).populate("userId", "fullName email");

    return failedAttempts;
};

// Get resource-specific audit trail
const getResourceAuditTrail = async (resource: AuditResource, resourceId: string, limit = 50) => {
    const trail = await AuditLogModel.find({
        resource,
        resourceId,
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("userId", "fullName email");

    return trail;
};

// Delete old audit logs (retention policy)
const deleteOldAuditLogs = async (daysToRetain = 365): Promise<number> => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToRetain);

    const result = await AuditLogModel.deleteMany({
        createdAt: { $lt: cutoffDate },
    });

    return result.deletedCount || 0;
};

export const auditServices = {
    createAuditLog,
    logAction,
    getAllAuditLogs,
    getAuditLogById,
    getUserActivity,
    getAuditStatistics,
    getFailedAttempts,
    getResourceAuditTrail,
    deleteOldAuditLogs,
};
