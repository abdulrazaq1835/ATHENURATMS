
import { Router } from "express";
import { createNewTask, getAllTask } from "../controllers/task.controller.js";

const router = Router()

router.route("/new-task").post(createNewTask)

router.route("/get/task/:projectId").get(getAllTask)



export default router;
