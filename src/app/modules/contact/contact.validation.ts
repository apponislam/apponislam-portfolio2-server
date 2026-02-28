import { z } from "zod";

export const contactValidation = {
    create: z.object({
        body: z.object({
            name: z.string().min(2, "Name must be at least 2 characters"),
            email: z.string().email("Invalid email format"),
            message: z.string().min(10, "Message must be at least 10 characters"),
            socialLink: z.string().url("Invalid URL").optional(),
        }),
    }),

    updateStatus: z.object({
        params: z.object({
            id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid contact ID"),
        }),
        body: z.object({
            status: z.enum(["PENDING", "READ", "REPLIED", "SOLVED", "REMOVED"]),
        }),
    }),

    reply: z.object({
        params: z.object({
            id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid contact ID"),
        }),
        body: z.object({
            replyMessage: z.string().min(1, "Reply message is required"),
        }),
    }),

    bulkUpdate: z.object({
        body: z.object({
            ids: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)),
            status: z.enum(["PENDING", "READ", "REPLIED", "SOLVED", "REMOVED"]),
        }),
    }),
};
