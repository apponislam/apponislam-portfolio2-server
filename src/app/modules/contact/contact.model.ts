// contact.model.ts
import mongoose, { Schema, Types } from "mongoose";
import { IContact } from "./contact.interface";

const contactSchema = new Schema<IContact>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            index: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            index: true,
        },

        message: {
            type: String,
            required: [true, "Message is required"],
        },

        socialLink: { type: String },

        status: {
            type: String,
            enum: ["PENDING", "READ", "REPLIED", "SOLVED", "REMOVED"],
            default: "PENDING",
            index: true,
        },

        repliedBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
        repliedAt: { type: Date },
        replyMessage: { type: String },

        isDeleted: { type: Boolean, default: false, index: true },

        removedBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
        removeReason: { type: String },
    },
    {
        timestamps: true,
    },
);

// Essential indexes for your most common queries
contactSchema.index({ status: 1, isDeleted: 1, createdAt: -1 }); // Dashboard filtering
contactSchema.index({ email: 1, status: 1 }); // Email lookups
contactSchema.index({ repliedBy: 1, repliedAt: -1 }); // Reply tracking
contactSchema.index({ removedBy: 1, createdAt: -1 }); // Removal tracking
contactSchema.index({ createdAt: -1 }); // Default sorting

// Optional: text search if needed
contactSchema.index({ name: "text", email: "text", message: "text" });

export const ContactModel = mongoose.model<IContact>("Contact", contactSchema);
