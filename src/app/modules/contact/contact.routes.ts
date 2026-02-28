import { Router } from "express";

import { contactValidation } from "./contact.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorized";
import { contactControllers } from "./contact.controllers";

const router = Router();

// Public routes
router.post("/", validateRequest(contactValidation.create), contactControllers.createContact);

// Admin only routes
router.get("/", auth, authorize(["admin", "superadmin"]), contactControllers.getAllContacts);

router.get("/statistics", authorize(["admin", "superadmin"]), contactControllers.getStatistics);

router.get("/:id", authorize(["admin", "superadmin"]), contactControllers.getContactById);

router.patch("/:id/status", authorize(["admin", "superadmin"]), validateRequest(contactValidation.updateStatus), contactControllers.updateStatus);

router.post("/:id/reply", authorize(["admin", "superadmin"]), validateRequest(contactValidation.reply), contactControllers.replyToContact);

router.delete("/:id/soft", authorize(["admin", "superadmin"]), contactControllers.softDeleteContact);

router.post("/:id/restore", authorize(["admin", "superadmin"]), contactControllers.restoreContact);

// Super admin only
router.delete("/:id/permanent", authorize(["superadmin"]), contactControllers.permanentDelete);

router.post("/bulk/status", authorize(["admin", "superadmin"]), validateRequest(contactValidation.bulkUpdate), contactControllers.bulkUpdateStatus);

export default router;
