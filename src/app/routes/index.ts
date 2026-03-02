import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { feedbackRoutes } from "../modules/feedback/feedback.routes";
import { auditRoutes } from "../modules/audit/audit.routes";

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
        path: "/audit",
        route: auditRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
