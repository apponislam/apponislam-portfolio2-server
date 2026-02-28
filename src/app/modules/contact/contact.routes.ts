import { Router } from "express";

import { contactValidation } from "./contact.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorized";
import { ContactController } from "./contact.controllers";

const router = Router();
const contactController = new ContactController();

// Public routes
router.post("/", validateRequest(contactValidation.create), contactController.createContact.bind(contactController));

// Admin only routes
router.get("/", auth, authorize(["admin", "superadmin"]), contactController.getAllContacts.bind(contactController));

router.get("/statistics", authorize(["admin", "superadmin"]), contactController.getStatistics.bind(contactController));

router.get("/:id", authorize(["admin", "superadmin"]), contactController.getContactById.bind(contactController));

router.patch("/:id/status", authorize(["admin", "superadmin"]), validateRequest(contactValidation.updateStatus), contactController.updateStatus.bind(contactController));

router.post("/:id/reply", authorize(["admin", "superadmin"]), validateRequest(contactValidation.reply), contactController.replyToContact.bind(contactController));

router.delete("/:id/soft", authorize(["admin", "superadmin"]), contactController.softDeleteContact.bind(contactController));

router.post("/:id/restore", authorize(["admin", "superadmin"]), contactController.restoreContact.bind(contactController));

// Super admin only
router.delete("/:id/permanent", authorize(["superadmin"]), contactController.permanentDelete.bind(contactController));

router.post("/bulk/status", authorize(["admin", "superadmin"]), validateRequest(contactValidation.bulkUpdate), contactController.bulkUpdateStatus.bind(contactController));

export default router;
