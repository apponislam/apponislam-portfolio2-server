import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { Request, Response } from "express";
import { feedbackServices } from "./feedback.services";
import ApiError from "../../../errors/ApiError";

// Create feedback
const createFeedback = catchAsync(async (req: Request, res: Response) => {
    const result = await feedbackServices.createFeedback(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Feedback submitted successfully",
        data: result,
    });
});

// Get all feedbacks
const getAllFeedbacks = catchAsync(async (req: Request, res: Response) => {
    const result = await feedbackServices.getAllFeedbacks(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feedbacks retrieved successfully",
        data: result.feedbacks,
        meta: result.pagination,
    });
});

// Get single feedback
const getFeedbackById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await feedbackServices.getFeedbackById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feedback retrieved successfully",
        data: result,
    });
});

// Update feedback
const updateFeedback = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await feedbackServices.updateFeedback(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feedback updated successfully",
        data: result,
    });
});

// Update feedback status
const updateFeedbackStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { status, adminNotes, assignedTo } = req.body;
    const result = await feedbackServices.updateFeedbackStatus(id, status, adminNotes, assignedTo);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feedback status updated successfully",
        data: result,
    });
});

// Get feedback statistics
const getFeedbackStatistics = catchAsync(async (req: Request, res: Response) => {
    const result = await feedbackServices.getFeedbackStatistics();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feedback statistics retrieved successfully",
        data: result,
    });
});

// Soft delete feedback
const softDeleteFeedback = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await feedbackServices.softDeleteFeedback(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feedback deleted successfully",
        data: null,
    });
});

// Restore feedback
const restoreFeedback = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await feedbackServices.restoreFeedback(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feedback restored successfully",
        data: result,
    });
});

// Permanent delete feedback
const permanentDeleteFeedback = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await feedbackServices.permanentDeleteFeedback(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feedback permanently deleted successfully",
        data: null,
    });
});

export const feedbackControllers = {
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
