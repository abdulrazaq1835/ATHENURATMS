import { Router } from "express";
import { generateInviteLink, acceptInvite } from "../controllers/inviteToken.controller.js";
import { verifyJWT, verifyWorkspaceAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected route for managers to generate an invite
router.route("/generate").post(verifyJWT, verifyWorkspaceAdmin, generateInviteLink);

// Public route for users to accept an invite, since they submit credentials here
router.route("/accept").post(acceptInvite);

export default router;
