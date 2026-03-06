import { z } from "zod";

export const projectValidations = {
    create: z.object({
        body: z.object({
            title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must not exceed 200 characters"),
            description: z.string().min(10, "Description must be at least 10 characters").max(5000, "Description must not exceed 5000 characters"),
            shortDescription: z.string().max(200, "Short description must not exceed 200 characters").optional(),
            category: z.enum(["web", "mobile", "desktop", "fullstack", "frontend", "backend", "api", "other"]),
            technologies: z.array(z.string()).min(1, "At least one technology is required"),
            status: z.enum(["completed", "in_progress", "planned", "archived"]).optional(),
            featured: z.boolean().optional(),
            imageUrl: z.string().url("Invalid image URL").optional(),
            thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
            images: z.array(z.string().url("Invalid image URL")).optional(),
            githubUrl: z.string().url("Invalid GitHub URL").optional().nullable(),
            liveUrl: z.string().url("Invalid live URL").optional().nullable(),
            demoUrl: z.string().url("Invalid demo URL").optional().nullable(),
            startDate: z.string().datetime().optional(),
            endDate: z.string().datetime().optional(),
            duration: z.string().optional(),
            team: z.array(z.string()).optional(),
            keyFeatures: z.array(z.string()).optional(),
            challenges: z.array(z.string()).optional(),
            solutions: z.array(z.string()).optional(),
            links: z
                .array(
                    z.object({
                        label: z.string(),
                        url: z.string().url("Invalid URL"),
                    }),
                )
                .optional(),
            content: z.string().optional(),
            tags: z.array(z.string()).optional(),
            order: z.number().optional(),
        }),
    }),

    update: z.object({
        params: z.object({
            id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID"),
        }),
        body: z.object({
            title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must not exceed 200 characters").optional(),
            description: z.string().min(10, "Description must be at least 10 characters").max(5000, "Description must not exceed 5000 characters").optional(),
            shortDescription: z.string().max(200, "Short description must not exceed 200 characters").optional().nullable(),
            category: z.enum(["web", "mobile", "desktop", "fullstack", "frontend", "backend", "api", "other"]).optional(),
            technologies: z.array(z.string()).optional(),
            status: z.enum(["completed", "in_progress", "planned", "archived"]).optional(),
            featured: z.boolean().optional(),
            imageUrl: z.string().url("Invalid image URL").optional().nullable(),
            thumbnailUrl: z.string().url("Invalid thumbnail URL").optional().nullable(),
            images: z.array(z.string().url("Invalid image URL")).optional(),
            githubUrl: z.string().url("Invalid GitHub URL").optional().nullable(),
            liveUrl: z.string().url("Invalid live URL").optional().nullable(),
            demoUrl: z.string().url("Invalid demo URL").optional().nullable(),
            startDate: z.string().datetime().optional().nullable(),
            endDate: z.string().datetime().optional().nullable(),
            duration: z.string().optional(),
            team: z.array(z.string()).optional(),
            keyFeatures: z.array(z.string()).optional(),
            challenges: z.array(z.string()).optional(),
            solutions: z.array(z.string()).optional(),
            links: z
                .array(
                    z.object({
                        label: z.string(),
                        url: z.string().url("Invalid URL"),
                    }),
                )
                .optional(),
            content: z.string().optional(),
            tags: z.array(z.string()).optional(),
            order: z.number().optional(),
        }),
    }),

    updateMetrics: z.object({
        params: z.object({
            id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID"),
        }),
        body: z.object({
            incrementViews: z.boolean().optional(),
            incrementDownloads: z.boolean().optional(),
            incrementStars: z.boolean().optional(),
        }),
    }),

    reorder: z.object({
        body: z.array(
            z.object({
                id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID"),
                order: z.number(),
            }),
        ),
    }),
};
