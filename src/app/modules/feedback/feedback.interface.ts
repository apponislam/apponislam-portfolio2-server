export type FeedbackCategory = "bug" | "feature_request" | "content" | "ui_ux" | "performance" | "other";
export type FeedbackStatus = "pending" | "reviewed" | "resolved" | "dismissed";
export type FeedbackPriority = "low" | "medium" | "high";

export interface IFeedback {
    id: string;
    category: FeedbackCategory;
    title: string;
    message: string;
    rating?: number;
    status: FeedbackStatus;
    priority?: FeedbackPriority;
    adminNotes?: string;
    submittedAt: Date;
    reviewedAt?: Date;
    resolvedAt?: Date;
    tags?: string[];
    pageUrl?: string;
    browserInfo?: string;
    ipAddress?: string;
    source?: "web" | "mobile" | "email";
    assignedTo?: string;
}
