export enum Profession {
    Developer = "developer",
    Designer = "designer",
    FullstackDeveloper = "fullstackDeveloper",
    FrontendDeveloper = "frontendDeveloper",
    BackendDeveloper = "backendDeveloper",
    UXDesigner = "uxDesigner",
    UIDesigner = "uiDesigner",
    ProjectManager = "projectManager",
    ContentCreator = "contentCreator",
    MarketingSpecialist = "marketingSpecialist",
    ProductManager = "productManager",
}

export interface SocialLink {
    platform: string;
    url: string;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    username?: string;

    role: "superadmin" | "admin" | "moderator" | "user" | "guest";
    profession?: Profession;
    password: string;

    avatar?: string;
    bio?: string;
    website?: string;
    location?: string;
    skills?: string[];
    socialLinks?: SocialLink[];

    isActive?: boolean;
    isDeleted?: boolean;
    isDeactivated?: boolean;
    isEmailVerified?: boolean;

    // Password reset fields
    resetPasswordOtp?: string;
    resetPasswordOtpExpiry?: Date;
    resetPasswordToken?: string;
    resetPasswordTokenExpiry?: Date;

    // Email verification fields (new)
    verificationToken?: string;
    verificationExpiry?: Date;

    // Email update fields
    pendingEmail?: string;
    emailVerificationToken?: string;
    emailVerificationExpiry?: Date;

    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
