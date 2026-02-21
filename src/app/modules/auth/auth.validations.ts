import { z } from "zod";

// Reusable enums
const roleEnum = z.enum(["superadmin", "admin", "moderator", "user", "guest"]);
const professionEnum = z.enum(["developer", "designer", "fullstackDeveloper", "frontendDeveloper", "backendDeveloper", "uxDesigner", "uiDesigner", "projectManager", "contentCreator", "marketingSpecialist", "productManager"]);

// Base schemas
export const registerSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    username: z.string().min(3, "Username must be at least 3 characters").optional(),
    role: roleEnum.default("user"),
    profession: professionEnum.optional(),
    avatar: z.string().url("Invalid URL format").optional(),
    bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
    website: z.string().url("Invalid URL format").optional(),
    location: z.string().optional(),
    skills: z.array(z.string()).optional(),
    socialLinks: z
        .array(
            z.object({
                platform: z.string().min(1, "Platform is required"),
                url: z.string().url("Invalid URL format"),
            }),
        )
        .optional(),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
    token: z.string().min(1, "Verification token is required"),
    email: z.string().email("Invalid email format"),
});

export const resendVerificationSchema = z.object({
    email: z.string().email("Invalid email format"),
});

export const updateProfileSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
    username: z.string().min(3, "Username must be at least 3 characters").optional(),
    profession: professionEnum.optional(),
    avatar: z.string().url("Invalid URL format").optional(),
    bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
    website: z.string().url("Invalid URL format").optional(),
    location: z.string().optional(),
    skills: z.array(z.string()).optional(),
    socialLinks: z
        .array(
            z.object({
                platform: z.string().min(1, "Platform is required"),
                url: z.string().url("Invalid URL format"),
            }),
        )
        .optional(),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email format"),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const updateEmailSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

export const resendEmailUpdateSchema = z.object({
    password: z.string().min(1, "Password is required"),
});

// Admin schemas
export const updateUserRoleSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    role: roleEnum,
});

export const toggleUserStatusSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    action: z.enum(["activate", "deactivate", "delete", "restore"]),
});

// Types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
export type ResendEmailUpdateInput = z.infer<typeof resendEmailUpdateSchema>;
