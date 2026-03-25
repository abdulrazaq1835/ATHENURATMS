import { Router } from "express";
import { bulkUploadUsers, changePassword, getAllUsers } from "../controllers/user.controller.js";
import { verifyJWT, verifySuperuser } from "../middlewares/auth.middleware.js";

const router = Router();

// Routes for superuser
router.route("/all").get(verifyJWT, verifySuperuser, getAllUsers);

router.route("/bulk-upload").post(verifyJWT, verifySuperuser, bulkUploadUsers);

// Routes for all authenticated users
router.route("/change-password").post(verifyJWT, changePassword);

export default router;
