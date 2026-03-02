import { Router } from "express";
import { feedbackControllers } from "./feedback.controllers";
import { feedbackValidations } from "./feedback.validations";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorized";

const router = Router();

// Public routes
router.post("/", validateRequest(feedbackValidations.create), feedbackControllers.createFeedback);

// Admin only routes
router.get("/", auth, authorize(["admin", "superadmin"]), feedbackControllers.getAllFeedbacks);

router.get("/statistics", auth, authorize(["admin", "superadmin"]), feedbackControllers.getFeedbackStatistics);

router.get("/:id", auth, authorize(["admin", "superadmin"]), feedbackControllers.getFeedbackById);

router.patch("/:id", auth, authorize(["admin", "superadmin"]), validateRequest(feedbackValidations.update), feedbackControllers.updateFeedback);

router.patch("/:id/status", auth, authorize(["admin", "superadmin"]), validateRequest(feedbackValidations.updateStatus), feedbackControllers.updateFeedbackStatus);

router.delete("/:id/soft", auth, authorize(["admin", "superadmin"]), feedbackControllers.softDeleteFeedback);

router.post("/:id/restore", auth, authorize(["admin", "superadmin"]), feedbackControllers.restoreFeedback);

// Super admin only
router.delete("/:id/permanent", auth, authorize(["superadmin"]), feedbackControllers.permanentDeleteFeedback);

export const feedbackRoutes = router;
