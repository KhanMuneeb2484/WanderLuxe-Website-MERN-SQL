import express from "express";
import {
  createBooking,
  deleteBooking,
  getBookingsByUserId,
} from "../controllers/bookingController.js";
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

// Get all bookings for a specific user
router.get(
  "/user-bookings",
  authenticateJWT,
  requireRole(["user"]),
  getBookingsByUserId
);
export default router;
