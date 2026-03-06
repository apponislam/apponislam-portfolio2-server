import mongoose, { Schema } from "mongoose";
import { IProject } from "./projects.interface";

const ProjectSchema = new Schema<IProject>(
    {
        title: {
            type: String,
            required: [true, "Project title is required"],
            index: true,
        },
        description: {
            type: String,
            required: [true, "Project description is required"],
        },
        shortDescription: {
            type: String,
            maxlength: 200,
        },
        category: {
            type: String,
            enum: ["web", "mobile", "desktop", "fullstack", "frontend", "backend", "api", "other"],
            required: [true, "Category is required"],
            index: true,
        },
        technologies: {
            type: [String],
            required: [true, "Technologies are required"],
            index: true,
        },
        status: {
            type: String,
            enum: ["completed", "in_progress", "planned", "archived"],
            default: "completed",
            index: true,
        },
        featured: {
            type: Boolean,
            default: false,
            index: true,
        },
        imageUrl: String,
        thumbnailUrl: String,
        images: {
            type: [String],
            default: [],
        },
        githubUrl: String,
        liveUrl: String,
        demoUrl: String,
        startDate: Date,
        endDate: Date,
        duration: String,
        team: {
            type: [String],
            default: [],
        },
        keyFeatures: {
            type: [String],
            default: [],
        },
        challenges: {
            type: [String],
            default: [],
        },
        solutions: {
            type: [String],
            default: [],
        },
        metrics: {
            views: {
                type: Number,
                default: 0,
            },
            downloads: {
                type: Number,
                default: 0,
            },
            stars: {
                type: Number,
                default: 0,
            },
            performance: String,
        },
        links: [
            {
                label: String,
                url: String,
            },
        ],
        content: String,
        tags: {
            type: [String],
            default: [],
            index: true,
        },
        order: {
            type: Number,
            default: 0,
            index: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// Single-field indexes
ProjectSchema.index({ title: 1 }, { name: "project_title_index" });
ProjectSchema.index({ category: 1 }, { name: "project_category_index" });
ProjectSchema.index({ featured: 1 }, { name: "project_featured_index" });
ProjectSchema.index({ status: 1 }, { name: "project_status_index" });
ProjectSchema.index({ order: 1 }, { name: "project_order_index" });
ProjectSchema.index({ technologies: 1 }, { name: "project_technologies_index" });
ProjectSchema.index({ tags: 1 }, { name: "project_tags_index" });
ProjectSchema.index({ createdAt: -1 }, { name: "project_createdAt_desc_index" });

// Compound indexes
ProjectSchema.index({ featured: 1, status: 1, isDeleted: 1 }, { name: "project_featured_status_isDeleted_index" });
ProjectSchema.index({ category: 1, status: 1, isDeleted: 1 }, { name: "project_category_status_isDeleted_index" });
ProjectSchema.index({ isDeleted: 1, featured: 1, order: 1 }, { name: "project_isDeleted_featured_order_index" });

// Text search index
ProjectSchema.index({ title: "text", description: "text", tags: "text" }, { name: "project_text_search_index" });

export const ProjectModel = mongoose.model<IProject>("Project", ProjectSchema);
