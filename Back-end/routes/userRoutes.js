import express from "express";
import {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserById,
  getUser,
  getAllUsers,
} from "../controllers/userController.js";
import { authenticateJWT, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a new user
router.post("/register-user", registerUser);

// Login user
router.post("/login-user", loginUser);

// Update user (requires authentication)
router.patch("/update-user", authenticateJWT, updateUser);

// Get user by id (requires authentication)
router.get(
  "/get-user-by-id/:userId",
  authenticateJWT,
  requireRole(["admin"]),
  getUserById
);

// Get user(himself)  (requires authentication)
router.get("/get-user", authenticateJWT, getUser);

// Get all users (requires authentication and admin role)

router.get(
  "/get-all-users",
  authenticateJWT,
  requireRole(["admin"]),
  getAllUsers
);

// Delete user (requires authentication and admin role)
router.delete(
  "/delete-user/:userId",
  authenticateJWT,
  requireRole(["admin"]),
  deleteUser
);

export default router;
