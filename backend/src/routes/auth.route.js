import { Router } from "express";
import {
        changeCurrentPassword,
        registerUser,
        updateAvatar,
        updateUserProfileFileds,
        userFetch,
        userLoggedIn,
        userLoggedOut
  }  from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()


router.route("/user/register").post(registerUser)

router.route("/user/login" ).post(userLoggedIn)

router.route("/user/logout").post(verifyJWT, userLoggedOut)

router.route("/user/fetch").get(verifyJWT, userFetch)

router.route("/user/update-profile").get(verifyJWT, updateUserProfileFileds)

router.route("/user/change-password").get(verifyJWT, changeCurrentPassword)

router.route("/user/update-avatar").get(verifyJWT, updateAvatar)


export default router;
