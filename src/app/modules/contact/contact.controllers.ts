import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { Types } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { contactServices } from "./contact.services";

// Create new contact
const createContact = catchAsync(async (req, res) => {
    const contactData = req.body;
    const contact = await contactServices.createContact(contactData);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Contact message sent successfully",
        data: contact,
    });
});

// Get all contacts
const getAllContacts = catchAsync(async (req, res) => {
    const result = await contactServices.getAllContacts(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Contacts retrieved successfully",
        data: result.contacts,
        meta: result.pagination, // or result.meta depending on your sendResponse
    });
});

// Get single contact
const getContactById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const contact = await contactServices.getContactById(id as string);

    if (!contact) {
        throw new ApiError(httpStatus.NOT_FOUND, "Contact not found");
    }

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Contact retrieved successfully",
        data: contact,
    });
});

// Update contact status
const updateStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const contact = await contactServices.updateStatus(id as string, status);

    if (!contact) {
        throw new ApiError(httpStatus.NOT_FOUND, "Contact not found");
    }

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Contact status updated successfully",
        data: contact,
    });
});

// Reply to contact
const replyToContact = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { replyMessage } = req.body;

    // Assuming user info is attached to req by auth middleware
    const userId = new Types.ObjectId(req.user?._id);

    const contact = await contactServices.replyToContact(id as string, {
        replyMessage,
        repliedBy: userId,
    });

    if (!contact) {
        throw new ApiError(httpStatus.NOT_FOUND, "Contact not found");
    }

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Reply sent successfully",
        data: contact,
    });
});

// Soft delete contact
const softDeleteContact = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { removeReason } = req.body;

    const userId = new Types.ObjectId(req.user?._id);

    const contact = await contactServices.softDeleteContact(id as string, userId, removeReason);

    if (!contact) {
        throw new ApiError(httpStatus.NOT_FOUND, "Contact not found");
    }

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Contact deleted successfully",
        data: contact,
    });
});

// Restore contact
const restoreContact = catchAsync(async (req, res) => {
    const { id } = req.params;

    const contact = await contactServices.restoreContact(id as string);

    if (!contact) {
        throw new ApiError(httpStatus.NOT_FOUND, "Contact not found");
    }

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Contact restored successfully",
        data: contact,
    });
});

// Permanently delete contact
const permanentDelete = catchAsync(async (req, res) => {
    const { id } = req.params;

    const contact = await contactServices.permanentDelete(id as string);

    if (!contact) {
        throw new ApiError(httpStatus.NOT_FOUND, "Contact not found");
    }

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Contact permanently deleted",
        data: null,
    });
});

// Bulk update status
const bulkUpdateStatus = catchAsync(async (req, res) => {
    const { ids, status } = req.body;

    const result = await contactServices.bulkUpdateStatus(ids, status);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: `${result.modifiedCount} contacts updated successfully`,
        data: result,
    });
});

// Get statistics
const getStatistics = catchAsync(async (req, res) => {
    const stats = await contactServices.getStatistics();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Statistics retrieved successfully",
        data: stats,
    });
});

export const contactControllers = {
    createContact,
    getAllContacts,
    getContactById,
    updateStatus,
    replyToContact,
    softDeleteContact,
    restoreContact,
    permanentDelete,
    bulkUpdateStatus,
    getStatistics,
};
