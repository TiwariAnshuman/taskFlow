import express from "express";
import taskController from "../controllers/taskController.js";
 import { validateTask } from "../middleware/taskValidation.js";

const router = express.Router();

router.post("/", validateTask, taskController.createTask);

router.get("/", taskController.getAllTasks);

router.get("/:id", taskController.getTaskById);

router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);


export default router;