import { Router } from "express";
import { createUser, deleteUser, getCurrentUser, loginUser, logoutUser, updateUser } from "../controllers/UserController";
import { authenticate } from "../middlewares/authenticate";


const router = Router();

router.post("/signup-user",createUser);
router.post("/login-user",loginUser);
router.get("/current-user",authenticate,getCurrentUser);
router.put("/update-user",authenticate,updateUser);
router.delete("/delete-user",authenticate,deleteUser);
router.post("/logout-user",logoutUser);

export default router;



