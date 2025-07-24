// routes/userRoutes.ts
import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile
} from "../controllers/userController";
import { authenticateToken } from "../middleware/UserAuthMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticateToken, getUserProfile);

export default router;
