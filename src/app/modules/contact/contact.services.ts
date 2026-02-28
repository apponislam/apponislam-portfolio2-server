import { Types } from "mongoose";
import { ContactModel } from "./contact.model";
import { IContact, ContactStatus } from "./contact.interface";

// Create contact
const createContact = async (contactData: Partial<IContact>): Promise<IContact> => {
    const contact = new ContactModel(contactData);
    return await contact.save();
};

// Get all contacts with filtering and pagination
const getAllContacts = async (query: any) => {
    const { page = 1, limit = 10, status, isDeleted, search, startDate, endDate, sortBy = "createdAt", sortOrder = "desc" } = query;

    const filter: any = {};

    // Apply filters
    if (status) filter.status = status;
    if (isDeleted !== undefined) filter.isDeleted = isDeleted === "true";

    // Date range filter
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Search by name, email, or message
    if (search) {
        filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }, { message: { $regex: search, $options: "i" } }];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const contacts = await ContactModel.find(filter).populate("repliedBy", "name email").populate("removedBy", "name email").sort(sortOptions).skip(skip).limit(parseInt(limit));

    // Get total count
    const total = await ContactModel.countDocuments(filter);

    return {
        contacts,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    };
};

// Get single contact by ID
const getContactById = async (id: string): Promise<IContact | null> => {
    return await ContactModel.findById(id).populate("repliedBy", "name email").populate("removedBy", "name email");
};

// Update contact status
const updateStatus = async (id: string, status: ContactStatus): Promise<IContact | null> => {
    return await ContactModel.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
};

// Reply to contact message
const replyToContact = async (
    id: string,
    replyData: {
        replyMessage: string;
        repliedBy: Types.ObjectId;
        status?: ContactStatus;
    },
): Promise<IContact | null> => {
    return await ContactModel.findByIdAndUpdate(
        id,
        {
            replyMessage: replyData.replyMessage,
            repliedBy: replyData.repliedBy,
            repliedAt: new Date(),
            status: replyData.status || "REPLIED",
        },
        { new: true, runValidators: true },
    );
};

// Soft delete contact
const softDeleteContact = async (id: string, removedBy: Types.ObjectId, removeReason?: string): Promise<IContact | null> => {
    return await ContactModel.findByIdAndUpdate(
        id,
        {
            isDeleted: true,
            status: "REMOVED",
            removedBy,
            removeReason,
        },
        { new: true, runValidators: true },
    );
};

// Restore soft-deleted contact
const restoreContact = async (id: string): Promise<IContact | null> => {
    return await ContactModel.findByIdAndUpdate(
        id,
        {
            isDeleted: false,
            status: "PENDING",
            $unset: { removedBy: 1, removeReason: 1 },
        },
        { new: true, runValidators: true },
    );
};

// Permanently delete contact (admin only)
const permanentDelete = async (id: string): Promise<IContact | null> => {
    return await ContactModel.findByIdAndDelete(id);
};

// Bulk update status
const bulkUpdateStatus = async (ids: string[], status: ContactStatus): Promise<any> => {
    return await ContactModel.updateMany({ _id: { $in: ids } }, { status });
};

// Get statistics
const getStatistics = async (): Promise<any> => {
    const stats = await ContactModel.aggregate([
        {
            $facet: {
                totalContacts: [{ $count: "count" }],
                byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
                recentContacts: [{ $sort: { createdAt: -1 } }, { $limit: 5 }, { $project: { name: 1, email: 1, status: 1, createdAt: 1 } }],
                unreadCount: [{ $match: { status: "PENDING", isDeleted: false } }, { $count: "count" }],
            },
        },
    ]);

    return stats[0];
};

// Export all services as a single object
export const contactServices = {
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
