import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { Request, Response } from "express";
import { auditServices } from "./audit.services";

// Get all audit logs
const getAllAuditLogs = catchAsync(async (req: Request, res: Response) => {
    const result = await auditServices.getAllAuditLogs(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Audit logs retrieved successfully",
        data: result.logs,
        meta: result.pagination,
    });
});

// Get single audit log
const getAuditLogById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await auditServices.getAuditLogById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Audit log retrieved successfully",
        data: result,
    });
});

// Get user activity
const getUserActivity = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params as { userId: string };
    const { limit, days } = req.query;

    const result = await auditServices.getUserActivity(userId, {
        limit: limit ? parseInt(limit as string) : 50,
        days: days ? parseInt(days as string) : 30,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User activity retrieved successfully",
        data: result,
    });
});

// Get audit statistics
const getAuditStatistics = catchAsync(async (req: Request, res: Response) => {
    const result = await auditServices.getAuditStatistics();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Audit statistics retrieved successfully",
        data: result,
    });
});

// Get failed attempts for security
const getFailedAttempts = catchAsync(async (req: Request, res: Response) => {
    const { userId, hours } = req.query;

    const result = await auditServices.getFailedAttempts({
        userId: userId as string,
        hours: hours ? parseInt(hours as string) : 24,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Failed attempts retrieved successfully",
        data: result,
    });
});

// Get resource audit trail
const getResourceAuditTrail = catchAsync(async (req: Request, res: Response) => {
    const { resource, resourceId } = req.params as { resource: string; resourceId: string };
    const { limit } = req.query;

    const result = await auditServices.getResourceAuditTrail(resource as any, resourceId, limit ? parseInt(limit as string) : 50);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Resource audit trail retrieved successfully",
        data: result,
    });
});

// Delete old audit logs (admin only)
const deleteOldAuditLogs = catchAsync(async (req: Request, res: Response) => {
    const { daysToRetain } = req.body;
    const deletedCount = await auditServices.deleteOldAuditLogs(daysToRetain || 365);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `${deletedCount} old audit logs deleted successfully`,
        data: { deletedCount },
    });
});

export const auditControllers = {
    getAllAuditLogs,
    getAuditLogById,
    getUserActivity,
    getAuditStatistics,
    getFailedAttempts,
    getResourceAuditTrail,
    deleteOldAuditLogs,
};
