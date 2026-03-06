import { Types } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { ProjectModel } from "./projects.model";
import { IProject, ProjectStatus, ProjectCategory } from "./projects.interface";

// Create project
const createProject = async (projectData: Partial<IProject>): Promise<IProject> => {
    const project = new ProjectModel(projectData);
    return await project.save();
};

// Get all projects with filtering and pagination
const getAllProjects = async (query: any) => {
    const { page = 1, limit = 10, category, status, featured, technologies, search, sortBy = "order", sortOrder = "asc" } = query;

    const filter: any = { isDeleted: false };

    // Apply filters
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured) filter.featured = featured === "true" ? true : false;
    if (technologies) {
        const techArray = Array.isArray(technologies) ? technologies : [technologies];
        filter.technologies = { $in: techArray };
    }

    // Search by title, description, or tags
    if (search) {
        filter.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }, { tags: { $regex: search, $options: "i" } }];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const projects = await ProjectModel.find(filter).sort(sortOptions).skip(skip).limit(parseInt(limit));

    // Get total count
    const total = await ProjectModel.countDocuments(filter);

    return {
        projects,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    };
};

// Get featured projects
const getFeaturedProjects = async (limit: number = 6) => {
    const projects = await ProjectModel.find({ featured: true, isDeleted: false }).sort({ order: 1 }).limit(limit);
    return projects;
};

// Get single project
const getProjectById = async (id: string): Promise<IProject | null> => {
    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid project ID");
    }

    const project = await ProjectModel.findOne({ _id: id, isDeleted: false });

    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
    }

    return project;
};

// Update project
const updateProject = async (id: string, updateData: Partial<IProject>): Promise<IProject | null> => {
    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid project ID");
    }

    const project = await ProjectModel.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { new: true, runValidators: true });

    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
    }

    return project;
};

// Update project metrics
const updateProjectMetrics = async (id: string, metrics: any): Promise<IProject | null> => {
    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid project ID");
    }

    const updateData: any = { $inc: {} };

    if (metrics.incrementViews) {
        updateData.$inc["metrics.views"] = 1;
    }
    if (metrics.incrementDownloads) {
        updateData.$inc["metrics.downloads"] = 1;
    }
    if (metrics.incrementStars) {
        updateData.$inc["metrics.stars"] = 1;
    }

    const project = await ProjectModel.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { new: true });

    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
    }

    return project;
};

// Reorder projects
const reorderProjects = async (projects: { id: string; order: number }[]): Promise<void> => {
    const updatePromises = projects.map((project) => ProjectModel.findByIdAndUpdate(project.id, { order: project.order }, { new: true }));

    await Promise.all(updatePromises);
};

// Get projects by category
const getProjectsByCategory = async (category: ProjectCategory, options: any = {}) => {
    const { page = 1, limit = 10, sortBy = "order", sortOrder = "asc" } = options;

    const filter = { category, isDeleted: false, status: { $ne: "archived" } };
    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const projects = await ProjectModel.find(filter).sort(sortOptions).skip(skip).limit(limit);
    const total = await ProjectModel.countDocuments(filter);

    return {
        projects,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

// Get projects by technology
const getProjectsByTechnology = async (technology: string, options: any = {}) => {
    const { page = 1, limit = 10, sortBy = "order", sortOrder = "asc" } = options;

    const filter = { technologies: technology, isDeleted: false };
    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const projects = await ProjectModel.find(filter).sort(sortOptions).skip(skip).limit(limit);
    const total = await ProjectModel.countDocuments(filter);

    return {
        projects,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

// Get project statistics
const getProjectStatistics = async () => {
    const stats = await ProjectModel.aggregate([
        {
            $match: { isDeleted: false },
        },
        {
            $facet: {
                totalProjects: [{ $count: "count" }],
                byCategory: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
                byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
                featuredCount: [{ $match: { featured: true } }, { $count: "count" }],
                totalViews: [{ $group: { _id: null, total: { $sum: "$metrics.views" } } }],
                totalDownloads: [{ $group: { _id: null, total: { $sum: "$metrics.downloads" } } }],
                totalStars: [{ $group: { _id: null, total: { $sum: "$metrics.stars" } } }],
                technologies: [{ $unwind: "$technologies" }, { $group: { _id: "$technologies", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }],
            },
        },
    ]);

    return stats[0];
};

// Soft delete project
const softDeleteProject = async (id: string): Promise<void> => {
    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid project ID");
    }

    const project = await ProjectModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
    }
};

// Restore project
const restoreProject = async (id: string): Promise<IProject | null> => {
    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid project ID");
    }

    const project = await ProjectModel.findByIdAndUpdate(id, { isDeleted: false }, { new: true });

    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
    }

    return project;
};

// Permanent delete project
const permanentDeleteProject = async (id: string): Promise<void> => {
    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid project ID");
    }

    const result = await ProjectModel.findByIdAndDelete(id);

    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
    }
};

export const projectServices = {
    createProject,
    getAllProjects,
    getFeaturedProjects,
    getProjectById,
    updateProject,
    updateProjectMetrics,
    reorderProjects,
    getProjectsByCategory,
    getProjectsByTechnology,
    getProjectStatistics,
    softDeleteProject,
    restoreProject,
    permanentDeleteProject,
};
