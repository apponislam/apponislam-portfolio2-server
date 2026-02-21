import mongoose, { Schema } from "mongoose";
import { Profession, SocialLink } from "./auth.interface";

const SocialLinkSchema = new Schema<SocialLink>({
    platform: { type: String, required: [true, "Platform is required"] },
    url: { type: String, required: [true, "URL is required"] },
});

const UserSchema = new Schema(
    {
        fullName: { type: String, required: [true, "Full name is required"] },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            index: true,
            match: [/.+\@.+\..+/, "Please enter a valid email address"],
        },
        username: { type: String, unique: true, sparse: true, index: true },
        role: {
            type: String,
            enum: ["superadmin", "admin", "moderator", "user", "guest"],
            default: "user",
            required: [true, "Role is required"],
        },
        profession: {
            type: String,
            enum: Object.values(Profession),
        },
        password: { type: String, required: [true, "Password is required"] },
        avatar: String,
        bio: String,
        website: String,
        location: String,
        skills: { type: [String], default: [] },
        socialLinks: { type: [SocialLinkSchema], default: [] },

        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
        isDeactivated: { type: Boolean, default: false },
        isEmailVerified: { type: Boolean, default: false },

        // Password reset fields
        resetPasswordOtp: { type: String },
        resetPasswordOtpExpiry: { type: Date },
        resetPasswordToken: { type: String },
        resetPasswordTokenExpiry: { type: Date },

        // Email verification fields
        verificationToken: { type: String },
        verificationExpiry: { type: Date },

        // Email update fields
        pendingEmail: {
            type: String,
            match: [/.+\@.+\..+/, "Please enter a valid email address"],
        },
        emailVerificationToken: { type: String },
        emailVerificationExpiry: { type: Date },

        lastLogin: { type: Date },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            transform(doc, ret) {
                const r = ret as any;
                delete r.password;
                delete r.resetPasswordOtp;
                delete r.resetPasswordOtpExpiry;
                delete r.resetPasswordToken;
                delete r.resetPasswordTokenExpiry;
                delete r.verificationToken;
                delete r.verificationExpiry;
                delete r.emailVerificationToken;
                delete r.emailVerificationExpiry;
                return r;
            },
        },
    },
);

// Single-field indexes
UserSchema.index({ email: 1 }, { unique: true, name: "user_email_unique" });
UserSchema.index({ username: 1 }, { unique: true, sparse: true, name: "user_username_unique" });
UserSchema.index({ role: 1 }, { name: "user_role_index" });
UserSchema.index({ profession: 1 }, { name: "user_profession_index" });
UserSchema.index({ isActive: 1 }, { name: "user_isActive_index" });
UserSchema.index({ lastLogin: -1 }, { name: "user_lastLogin_desc_index" });

// Compound indexes
UserSchema.index({ role: 1, isActive: 1 }, { name: "user_role_isActive_index" });
UserSchema.index({ profession: 1, isActive: 1 }, { name: "user_profession_isActive_index" });

// Index for token lookups
UserSchema.index({ resetPasswordToken: 1 }, { name: "user_resetPasswordToken_index", sparse: true });
UserSchema.index({ verificationToken: 1 }, { name: "user_verificationToken_index", sparse: true });
UserSchema.index({ emailVerificationToken: 1 }, { name: "user_emailVerificationToken_index", sparse: true });

UserSchema.post("save", function (doc, next) {
    doc.password = undefined as any;
    next();
});

export const UserModel = mongoose.model("User", UserSchema);
