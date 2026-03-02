import mongoose, { Schema } from "mongoose";
import { IAuditLog } from "./audit.interface";

const AuditLogSchema = new Schema<IAuditLog>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, "User ID is required"],
            index: true,
        },
        action: {
            type: String,
            enum: ["CREATE", "READ", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "EMAIL_VERIFY", "PASSWORD_RESET", "PROFILE_UPDATE"],
            required: [true, "Action is required"],
            index: true,
        },
        resource: {
            type: String,
            enum: ["User", "Project", "Blog", "Contact", "Feedback", "Auth"],
            required: [true, "Resource is required"],
            index: true,
        },
        resourceId: {
            type: String,
            index: true,
            sparse: true,
        },
        oldData: {
            type: Schema.Types.Mixed,
            default: null,
        },
        newData: {
            type: Schema.Types.Mixed,
            default: null,
        },
        status: {
            type: String,
            enum: ["SUCCESS", "FAILED"],
            default: "SUCCESS",
            index: true,
        },
        statusCode: Number,
        errorMessage: String,
        ipAddress: {
            type: String,
            required: [true, "IP address is required"],
            index: true,
        },
        userAgent: String,
        changes: [
            {
                field: String,
                oldValue: Schema.Types.Mixed,
                newValue: Schema.Types.Mixed,
            },
        ],
        metadata: {
            type: Schema.Types.Mixed,
            default: null,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// Single-field indexes
AuditLogSchema.index({ userId: 1 }, { name: "audit_userId_index" });
AuditLogSchema.index({ action: 1 }, { name: "audit_action_index" });
AuditLogSchema.index({ resource: 1 }, { name: "audit_resource_index" });
AuditLogSchema.index({ status: 1 }, { name: "audit_status_index" });
AuditLogSchema.index({ ipAddress: 1 }, { name: "audit_ipAddress_index" });
AuditLogSchema.index({ createdAt: -1 }, { name: "audit_createdAt_desc_index" });

// Compound indexes
AuditLogSchema.index({ userId: 1, createdAt: -1 }, { name: "audit_userId_createdAt_index" });
AuditLogSchema.index({ action: 1, resource: 1 }, { name: "audit_action_resource_index" });
AuditLogSchema.index({ resource: 1, resourceId: 1 }, { name: "audit_resource_resourceId_index" });
AuditLogSchema.index({ userId: 1, action: 1, createdAt: -1 }, { name: "audit_userId_action_createdAt_index" });
AuditLogSchema.index({ status: 1, createdAt: -1 }, { name: "audit_status_createdAt_index" });

// TTL index - auto-delete logs after 1 year (31,536,000 seconds)
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000, name: "audit_ttl_index" });

export const AuditLogModel = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
