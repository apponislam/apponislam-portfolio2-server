import { z } from "zod";

export const feedbackValidations = {
    create: z.object({
        body: z.object({
            category: z.enum(["bug", "feature_request", "content", "ui_ux", "performance", "other"]),
            title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title must not exceed 200 characters"),
            message: z.string().min(10, "Message must be at least 10 characters").max(5000, "Message must not exceed 5000 characters"),
            rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must not exceed 5").optional(),
            priority: z.enum(["low", "medium", "high"]).optional(),
            pageUrl: z.string().url("Invalid URL format").optional(),
            browserInfo: z.string().optional(),
            source: z.enum(["web", "mobile", "email"]).optional(),
            tags: z.array(z.string()).optional(),
        }),
    }),

    update: z.object({
        params: z.object({
            id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid feedback ID"),
        }),
        body: z.object({
            category: z.enum(["bug", "feature_request", "content", "ui_ux", "performance", "other"]).optional(),
            title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title must not exceed 200 characters").optional(),
            message: z.string().min(10, "Message must be at least 10 characters").max(5000, "Message must not exceed 5000 characters").optional(),
            rating: z.number().int().min(1).max(5).optional(),
            priority: z.enum(["low", "medium", "high"]).optional(),
            pageUrl: z.string().url("Invalid URL format").optional().nullable(),
            browserInfo: z.string().optional().nullable(),
            tags: z.array(z.string()).optional(),
        }),
    }),

    updateStatus: z.object({
        params: z.object({
            id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid feedback ID"),
        }),
        body: z.object({
            status: z.enum(["pending", "reviewed", "resolved", "dismissed"]),
            adminNotes: z.string().max(1000, "Admin notes must not exceed 1000 characters").optional(),
            assignedTo: z
                .string()
                .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID")
                .optional()
                .nullable(),
        }),
    }),
};
