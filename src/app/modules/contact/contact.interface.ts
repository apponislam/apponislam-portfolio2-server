import { Types } from "mongoose";

export type ContactStatus = "PENDING" | "READ" | "REPLIED" | "SOLVED" | "REMOVED";

export interface IContact {
    name: string;
    email: string;
    message: string;

    socialLink?: string;
    status: ContactStatus;

    repliedBy?: Types.ObjectId;
    repliedAt?: Date;
    replyMessage?: string;

    isDeleted: boolean;

    removedBy?: Types.ObjectId;
    removeReason?: string;
}
