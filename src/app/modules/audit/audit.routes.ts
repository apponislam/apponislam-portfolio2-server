import { Router } from "express";
import { auditControllers } from "./audit.controllers";
import { auditValidations } from "./audit.validations";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorized";

const router = Router();

// Admin only routes
router.get("/", auth, authorize(["admin", "superadmin"]), auditControllers.getAllAuditLogs);

router.get("/statistics", auth, authorize(["admin", "superadmin"]), auditControllers.getAuditStatistics);

router.get("/failed-attempts", auth, authorize(["admin", "superadmin"]), auditControllers.getFailedAttempts);

router.get("/:id", auth, authorize(["admin", "superadmin"]), validateRequest(auditValidations.getById), auditControllers.getAuditLogById);

router.get("/user/:userId/activity", auth, authorize(["admin", "superadmin"]), validateRequest(auditValidations.getUserActivity), auditControllers.getUserActivity);

router.get("/resource/:resource/:resourceId", auth, authorize(["admin", "superadmin"]), validateRequest(auditValidations.getResourceAuditTrail), auditControllers.getResourceAuditTrail);

// Super admin only
router.post("/cleanup", auth, authorize(["superadmin"]), validateRequest(auditValidations.deleteOldLogs), auditControllers.deleteOldAuditLogs);

export const auditRoutes = router;
