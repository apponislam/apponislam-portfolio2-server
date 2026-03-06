export type ProjectStatus = "completed" | "in_progress" | "planned" | "archived";
export type ProjectCategory = "web" | "mobile" | "desktop" | "fullstack" | "frontend" | "backend" | "api" | "other";

export interface IProject {
    _id?: string;
    title: string;
    description: string;
    shortDescription?: string;
    category: ProjectCategory;
    technologies: string[];
    status: ProjectStatus;
    featured?: boolean;
    imageUrl?: string;
    thumbnailUrl?: string;
    images?: string[];
    githubUrl?: string;
    liveUrl?: string;
    demoUrl?: string;
    startDate?: Date;
    endDate?: Date;
    duration?: string;
    team?: string[];
    keyFeatures?: string[];
    challenges?: string[];
    solutions?: string[];
    metrics?: {
        views?: number;
        downloads?: number;
        stars?: number;
        performance?: string;
    };
    links?: {
        label: string;
        url: string;
    }[];
    content?: string;
    tags?: string[];
    order?: number;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
