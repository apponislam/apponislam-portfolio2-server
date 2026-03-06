import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { Request, Response } from "express";
import { projectServices } from "./projects.services";

// Create project
const createProject = catchAsync(async (req: Request, res: Response) => {
    const result = await projectServices.createProject(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Project created successfully",
        data: result,
    });
});

// Get all projects
const getAllProjects = catchAsync(async (req: Request, res: Response) => {
    const result = await projectServices.getAllProjects(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Projects retrieved successfully",
        data: result.projects,
        meta: result.pagination,
    });
});

// Get featured projects
const getFeaturedProjects = catchAsync(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    const result = await projectServices.getFeaturedProjects(limit);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Featured projects retrieved successfully",
        data: result,
    });
});

// Get single project
const getProjectById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await projectServices.getProjectById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Project retrieved successfully",
        data: result,
    });
});

// Update project
const updateProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await projectServices.updateProject(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Project updated successfully",
        data: result,
    });
});

// Update project metrics
const updateProjectMetrics = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await projectServices.updateProjectMetrics(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Project metrics updated successfully",
        data: result,
    });
});

// Reorder projects
const reorderProjects = catchAsync(async (req: Request, res: Response) => {
    await projectServices.reorderProjects(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Projects reordered successfully",
        data: null,
    });
});

// Get projects by category
const getProjectsByCategory = catchAsync(async (req: Request, res: Response) => {
    const { category } = req.params;
    const pageParam = (req.query.page ? (Array.isArray(req.query.page) ? req.query.page[0] : String(req.query.page)) : "1") as string;
    const limitParam = (req.query.limit ? (Array.isArray(req.query.limit) ? req.query.limit[0] : String(req.query.limit)) : "10") as string;
    const sortByParam = (req.query.sortBy ? (Array.isArray(req.query.sortBy) ? req.query.sortBy[0] : String(req.query.sortBy)) : "order") as string;
    const sortOrderParam = (req.query.sortOrder ? (Array.isArray(req.query.sortOrder) ? req.query.sortOrder[0] : String(req.query.sortOrder)) : "asc") as string;

    const result = await projectServices.getProjectsByCategory(category as any, {
        page: parseInt(pageParam),
        limit: parseInt(limitParam),
        sortBy: sortByParam,
        sortOrder: sortOrderParam,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Projects retrieved successfully",
        data: result.projects,
        meta: result.pagination,
    });
});

// Get projects by technology
const getProjectsByTechnology = catchAsync(async (req: Request, res: Response) => {
    const { technology } = req.params;
    const tech = Array.isArray(technology) ? technology[0] : technology;
    const pageParam = (req.query.page ? (Array.isArray(req.query.page) ? req.query.page[0] : String(req.query.page)) : "1") as string;
    const limitParam = (req.query.limit ? (Array.isArray(req.query.limit) ? req.query.limit[0] : String(req.query.limit)) : "10") as string;
    const sortByParam = (req.query.sortBy ? (Array.isArray(req.query.sortBy) ? req.query.sortBy[0] : String(req.query.sortBy)) : "order") as string;
    const sortOrderParam = (req.query.sortOrder ? (Array.isArray(req.query.sortOrder) ? req.query.sortOrder[0] : String(req.query.sortOrder)) : "asc") as string;

    const result = await projectServices.getProjectsByTechnology(tech, {
        page: parseInt(pageParam),
        limit: parseInt(limitParam),
        sortBy: sortByParam,
        sortOrder: sortOrderParam,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Projects retrieved successfully",
        data: result.projects,
        meta: result.pagination,
    });
});

// Get project statistics
const getProjectStatistics = catchAsync(async (req: Request, res: Response) => {
    const result = await projectServices.getProjectStatistics();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Project statistics retrieved successfully",
        data: result,
    });
});

// Soft delete project
const softDeleteProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await projectServices.softDeleteProject(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Project deleted successfully",
        data: null,
    });
});

// Restore project
const restoreProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await projectServices.restoreProject(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Project restored successfully",
        data: result,
    });
});

// Permanent delete project
const permanentDeleteProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await projectServices.permanentDeleteProject(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Project permanently deleted successfully",
        data: null,
    });
});

export const projectControllers = {
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
