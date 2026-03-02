import { z } from "zod";

export const auditValidations = {
    getById: z.object({
        params: z.object({
            id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid audit log ID"),
        }),
    }),

    getUserActivity: z.object({
        params: z.object({
            userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
        }),
        query: z.object({
            limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
            days: z.string().regex(/^\d+$/, "Days must be a number").optional(),
        }),
    }),

    getResourceAuditTrail: z.object({
        params: z.object({
            resource: z.enum(["User", "Project", "Blog", "Contact", "Feedback", "Auth"]),
            resourceId: z.string(),
        }),
        query: z.object({
            limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
        }),
    }),

    deleteOldLogs: z.object({
        body: z.object({
            daysToRetain: z.number().int().positive("Days to retain must be positive").default(365),
        }),
    }),
};
