// contact.model.ts
import mongoose, { Schema, Types } from "mongoose";
import { IContact } from "./contact.interface";

const contactSchema = new Schema<IContact>(
    {
        name: { type: String, required: true, index: true },
        email: { type: String, required: true, index: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },

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

// Compound indexes for better performance
contactSchema.index({ status: 1, isDeleted: 1, email: 1 });
contactSchema.index({ repliedBy: 1, repliedAt: -1 });

export const ContactModel = mongoose.model<IContact>("Contact", contactSchema);
