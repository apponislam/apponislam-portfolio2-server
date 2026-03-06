import { Router } from "express";
import { projectControllers } from "./projects.controllers";
import { projectValidations } from "./projects.validations";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorized";

const router = Router();

// Public routes - specific routes first
router.get("/", projectControllers.getAllProjects);
router.get("/featured", projectControllers.getFeaturedProjects);
router.get("/statistics", projectControllers.getProjectStatistics);
router.get("/category/:category", projectControllers.getProjectsByCategory);
router.get("/technology/:technology", projectControllers.getProjectsByTechnology);
router.get("/:id", projectControllers.getProjectById);

// Admin only routes - create
router.post("/", auth, authorize(["admin", "superadmin"]), validateRequest(projectValidations.create), projectControllers.createProject);

// Admin only routes - reorder (specific before generic)
router.post("/reorder", auth, authorize(["admin", "superadmin"]), validateRequest(projectValidations.reorder), projectControllers.reorderProjects);

// Admin only routes - generic id routes (last)
router.patch("/:id", auth, authorize(["admin", "superadmin"]), validateRequest(projectValidations.update), projectControllers.updateProject);

router.patch("/:id/metrics", auth, authorize(["admin", "superadmin"]), validateRequest(projectValidations.updateMetrics), projectControllers.updateProjectMetrics);

router.delete("/:id/soft", auth, authorize(["admin", "superadmin"]), projectControllers.softDeleteProject);

router.post("/:id/restore", auth, authorize(["admin", "superadmin"]), projectControllers.restoreProject);

// Super admin only
router.delete("/:id/permanent", auth, authorize(["superadmin"]), projectControllers.permanentDeleteProject);

export const projectRoutes = router;
