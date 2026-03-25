import { Router } from "express";
import { createProject, getAllProjectsByWorkspace, updateDeadline, updateProject } from "../controllers/project.controller.js";
import { verifyJWT, verifyWorkspaceMember, verifyWorkspaceAdmin } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route("/add/project").post(verifyWorkspaceAdmin, createProject)

router.route("/workspace/:workspaceId").get(verifyJWT, getAllProjectsByWorkspace)

router.route("/update/deadline/:projectId").post(verifyWorkspaceAdmin, updateDeadline)

router.route("/update/:projectId").put(verifyWorkspaceAdmin, updateProject)

export default router;
