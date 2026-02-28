export type ContactStatus = "PENDING" | "READ" | "REPLIED" | "SOLVED" | "REMOVED";

export interface Contact {
    name: string;
    email: string;
    subject: string;
    message: string;

    socialLink?: string;
    status: ContactStatus;

    repliedBy?: string;
    repliedAt?: Date;
    replyMessage?: string;

    isDeleted: boolean;
}
