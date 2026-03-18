import { Router } from "express";
import { createWorkspace, getWorkspaces, getWorkspaceById, addWorkspaceManager } from "../controllers/workspace.controller.js";
import { verifyJWT, verifySuperuser } from "../middlewares/auth.middleware.js";

const router = Router();

// Routes for superuser
router.route("/create").post(verifyJWT, verifySuperuser, createWorkspace);
router.route("/add-manager/:workspaceId").post(verifyJWT, verifySuperuser, addWorkspaceManager);

// Routes for all authenticated users
router.route("/all").get(verifyJWT, getWorkspaces);
router.route("/:workspaceId").get(verifyJWT, getWorkspaceById);

export default router;
