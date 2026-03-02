import mongoose, { Schema } from "mongoose";
import { IFeedback } from "./feedback.interface";

const FeedbackSchema = new Schema<IFeedback>(
    {
        category: {
            type: String,
            enum: ["bug", "feature_request", "content", "ui_ux", "performance", "other"],
            required: [true, "Category is required"],
            index: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            index: true,
        },
        message: {
            type: String,
            required: [true, "Message is required"],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        status: {
            type: String,
            enum: ["pending", "reviewed", "resolved", "dismissed"],
            default: "pending",
            index: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
            index: true,
        },
        adminNotes: String,
        submittedAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
        reviewedAt: Date,
        resolvedAt: Date,
        tags: { type: [String], default: [], index: true },
        pageUrl: String,
        browserInfo: String,
        ipAddress: String,
        source: {
            type: String,
            enum: ["web", "mobile", "email"],
            default: "web",
            index: true,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
            sparse: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// Single-field indexes
FeedbackSchema.index({ category: 1 }, { name: "feedback_category_index" });
FeedbackSchema.index({ title: 1 }, { name: "feedback_title_index" });
FeedbackSchema.index({ status: 1 }, { name: "feedback_status_index" });
FeedbackSchema.index({ priority: 1 }, { name: "feedback_priority_index" });
FeedbackSchema.index({ submittedAt: -1 }, { name: "feedback_submittedAt_desc_index" });
FeedbackSchema.index({ source: 1 }, { name: "feedback_source_index" });
FeedbackSchema.index({ assignedTo: 1 }, { name: "feedback_assignedTo_index", sparse: true });

// Compound indexes
FeedbackSchema.index({ status: 1, isDeleted: 1, submittedAt: -1 }, { name: "feedback_status_isDeleted_submittedAt_index" });
FeedbackSchema.index({ category: 1, status: 1 }, { name: "feedback_category_status_index" });
FeedbackSchema.index({ priority: 1, status: 1 }, { name: "feedback_priority_status_index" });
FeedbackSchema.index({ assignedTo: 1, status: 1 }, { name: "feedback_assignedTo_status_index" });

// Text search index
FeedbackSchema.index({ title: "text", message: "text" }, { name: "feedback_text_search_index" });

export const FeedbackModel = mongoose.model<IFeedback>("Feedback", FeedbackSchema);
