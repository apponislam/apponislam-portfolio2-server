import { z } from "zod";
import { Profession } from "./auth.interface";

// SocialLink schema
export const SocialLinkSchema = z.object({
    platform: z.string().min(1, { message: "Platform is required" }),
    url: z.string().min(1, { message: "URL is required" }).url({ message: "URL must be valid" }),
});

// User schema
export const UserSchema = z.object({
    id: z.string().optional(),
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }).max(30, { message: "Username cannot exceed 30 characters" }).optional(),

    role: z.enum(["superadmin", "admin", "moderator", "user", "guest"], {
        message: "Role is required and must be valid",
    }),

    profession: z.nativeEnum(Profession).optional(),

    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100, { message: "Password cannot exceed 100 characters" }),

    avatar: z.string().url({ message: "Avatar must be a valid URL" }).optional(),
    bio: z.string().max(500, { message: "Bio cannot exceed 500 characters" }).optional(),
    website: z.string().url({ message: "Website must be a valid URL" }).optional(),
    location: z.string().max(100, { message: "Location cannot exceed 100 characters" }).optional(),
    skills: z.array(z.string().min(1, { message: "Skill cannot be empty" })).optional(),
    socialLinks: z.array(SocialLinkSchema).optional(),

    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    isDeactivated: z.boolean().optional(),

    lastLogin: z.date().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
