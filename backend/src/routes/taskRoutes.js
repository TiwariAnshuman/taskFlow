import express from "express";
import taskController from "../controllers/taskController.js";
 import { validateTask } from "../middleware/taskValidation.js";

 import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

// all task routes require authentication
router.use(authMiddleware);


router.post("/", validateTask, taskController.createTask);



router.get("/", taskController.getAllTasks);

router.get("/:id", taskController.getTaskById);
router.put("/:id" , taskController.updateTask);


router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
 


export default router;