import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { feedbackRoutes } from "../modules/feedback/feedback.routes";
import { auditRoutes } from "../modules/audit/audit.routes";
import { contactRoutes } from "../modules/contact/contact.routes";
import { projectRoutes } from "../modules/projects/projects.routes";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes,
    },
    {
        path: "/feedback",
        route: feedbackRoutes,
    },
    {
        path: "/contact",
        route: contactRoutes,
    },
    {
        path: "/projects",
        route: projectRoutes,
    },
    {
        path: "/audit",
        route: auditRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
