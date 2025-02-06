import { Router } from "express";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/TaskController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/create-task",createTask);
router.get("/get-tasks",authenticate,getTasks);
router.put("/update-task/:id",updateTask);
router.delete("/delete-task/:id",deleteTask);


export default router;