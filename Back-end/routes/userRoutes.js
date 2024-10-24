import express from "express";
import {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticateJWT, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Update user (requires authentication)
router.patch("/update", authenticateJWT, updateUser);

// Delete user (requires authentication and admin role)
router.delete(
  "/delete/:userId",
  authenticateJWT,
  requireRole(["admin"]),
  deleteUser
);

export default router;
