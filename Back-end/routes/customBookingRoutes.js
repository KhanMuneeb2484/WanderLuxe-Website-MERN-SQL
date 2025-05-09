import express from "express";
import {
  createBooking,
  deleteBooking,
  getCustomBookingsByUserId,
} from "../controllers/customBookingController.js";
import { authenticateJWT, requireRole } from "../middleware/authMiddleware.js";
const router = express.Router();

// Route to create a booking
router.post("/create-booking", authenticateJWT, createBooking);

// Delete booking by ID
router.delete(
  "/delete-booking/:booking_id",
  authenticateJWT,
  requireRole(["admin"]),
  deleteBooking
);

// Get all custom bookings for the current user
router.get(
  "/user-bookings",
  authenticateJWT,
  requireRole(["user"]),
  getCustomBookingsByUserId
);

export default router;
