import { Types } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { FeedbackModel } from "./feedback.model";
import { IFeedback, FeedbackStatus, FeedbackPriority, FeedbackCategory } from "./feedback.interface";

// Create feedback
const createFeedback = async (feedbackData: Partial<IFeedback>): Promise<IFeedback> => {
    const feedback = new FeedbackModel(feedbackData);
    return await feedback.save();
};

// Get all feedbacks with filtering and pagination
const getAllFeedbacks = async (query: any) => {
    const { page = 1, limit = 10, category, status, priority, source, search, startDate, endDate, assignedTo, sortBy = "submittedAt", sortOrder = "desc" } = query;

    const filter: any = { isDeleted: false };

    // Apply filters
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (source) filter.source = source;
    if (assignedTo) filter.assignedTo = new Types.ObjectId(assignedTo);

    // Date range filter
    if (startDate || endDate) {
        filter.submittedAt = {};
        if (startDate) filter.submittedAt.$gte = new Date(startDate);
        if (endDate) filter.submittedAt.$lte = new Date(endDate);
    }

    // Search by title or message
    if (search) {
        filter.$or = [{ title: { $regex: search, $options: "i" } }, { message: { $regex: search, $options: "i" } }];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const feedbacks = await FeedbackModel.find(filter).populate("assignedTo", "fullName email").sort(sortOptions).skip(skip).limit(parseInt(limit));

    // Get total count
    const total = await FeedbackModel.countDocuments(filter);

    return {
        feedbacks,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    };
};

// Get single feedback
const getFeedbackById = async (id: string): Promise<IFeedback | null> => {
    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid feedback ID");
    }

    const feedback = await FeedbackModel.findOne({ _id: id, isDeleted: false }).populate("assignedTo", "fullName email");

    if (!feedback) {
        throw new ApiError(httpStatus.NOT_FOUND, "Feedback not found");
    }

    return feedback;
};

// Update feedback
const updateFeedback = async (id: string, updateData: Partial<IFeedback>): Promise<IFeedback | null> => {
    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid feedback ID");
    }

    const feedback = await FeedbackModel.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { new: true, runValidators: true }).populate("assignedTo", "fullName email");

    if (!feedback) {
        throw new ApiError(httpStatus.NOT_FOUND, "Feedback not found");
    }

    return feedback;
};

// Update feedback status
const updateFeedbackStatus = async (id: string, status: FeedbackStatus, adminNotes?: string, assignedTo?: string): Promise<IFeedback | null> => {
    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid feedback ID");
    }

    const updateData: any = { status, reviewedAt: new Date() };
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (assignedTo) updateData.assignedTo = new Types.ObjectId(assignedTo);

    if (status === "resolved") {
        updateData.resolvedAt = new Date();
    }

    const feedback = await FeedbackModel.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { new: true, runValidators: true }).populate("assignedTo", "fullName email");

    if (!feedback) {
        throw new ApiError(httpStatus.NOT_FOUND, "Feedback not found");
    }

    return feedback;
};

// Get feedback statistics
const getFeedbackStatistics = async () => {
    const [totalFeedbacks, statusStats, categoryStats, priorityStats, sourceStats] = await Promise.all([
        FeedbackModel.countDocuments({ isDeleted: false }),
        FeedbackModel.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
        FeedbackModel.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: "$category", count: { $sum: 1 } } }]),
        FeedbackModel.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: "$priority", count: { $sum: 1 } } }]),
        FeedbackModel.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: "$source", count: { $sum: 1 } } }]),
    ]);

    return {
        total: totalFeedbacks,
        statusStats: statusStats.reduce((acc, stat) => ({ ...acc, [stat._id]: stat.count }), {}),
        categoryStats: categoryStats.reduce((acc, stat) => ({ ...acc, [stat._id]: stat.count }), {}),
        priorityStats: priorityStats.reduce((acc, stat) => ({ ...acc, [stat._id]: stat.count }), {}),
        sourceStats: sourceStats.reduce((acc, stat) => ({ ...acc, [stat._id]: stat.count }), {}),
    };
};

// Soft delete feedback
const softDeleteFeedback = async (id: string): Promise<IFeedback | null> => {
    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid feedback ID");
    }

    const feedback = await FeedbackModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });

    if (!feedback) {
        throw new ApiError(httpStatus.NOT_FOUND, "Feedback not found");
    }

    return feedback;
};

// Restore feedback
const restoreFeedback = async (id: string): Promise<IFeedback | null> => {
    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid feedback ID");
    }

    const feedback = await FeedbackModel.findOneAndUpdate({ _id: id, isDeleted: true }, { isDeleted: false }, { new: true });

    if (!feedback) {
        throw new ApiError(httpStatus.NOT_FOUND, "Feedback not found");
    }

    return feedback;
};

// Permanent delete feedback (superadmin only)
const permanentDeleteFeedback = async (id: string): Promise<void> => {
    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid feedback ID");
    }

    const result = await FeedbackModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Feedback not found");
    }
};

export const feedbackServices = {
    createFeedback,
    getAllFeedbacks,
    getFeedbackById,
    updateFeedback,
    updateFeedbackStatus,
    getFeedbackStatistics,
    softDeleteFeedback,
    restoreFeedback,
    permanentDeleteFeedback,
};
