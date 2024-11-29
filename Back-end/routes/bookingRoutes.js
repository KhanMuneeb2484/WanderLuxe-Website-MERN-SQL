import express from "express";
import { createBooking } from "../controllers/bookingController.js";
import { authenticateJWT, requireRole } from "../middleware/authMiddleware.js";
const router = express.Router();

// Route to create a booking
router.post("/create-booking", authenticateJWT, createBooking);

export default router;
