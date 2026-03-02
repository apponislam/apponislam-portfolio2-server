import { Types } from "mongoose";

export type AuditAction = "CREATE" | "READ" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "EMAIL_VERIFY" | "PASSWORD_RESET" | "PROFILE_UPDATE";

export type AuditResource = "User" | "Project" | "Blog" | "Contact" | "Feedback" | "Auth";

export type AuditStatus = "SUCCESS" | "FAILED";

export interface IAuditLog {
    _id?: string;
    userId: Types.ObjectId | string;
    action: AuditAction;
    resource: AuditResource;
    resourceId?: string;
    oldData?: Record<string, any>;
    newData?: Record<string, any>;
    status: AuditStatus;
    statusCode?: number;
    errorMessage?: string;
    ipAddress: string;
    userAgent?: string;
    changes?: {
        field: string;
        oldValue: any;
        newValue: any;
    }[];
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}
