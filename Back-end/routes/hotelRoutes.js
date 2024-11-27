import express from "express";
import {
  registerHotel,
  updateHotel,
  deleteHotel,
  getAllHotels,
  getHotelById,
} from "../controllers/hotelController.js";
import { authenticateJWT, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register-hotel",
  authenticateJWT,
  requireRole(["admin"]),
  registerHotel
);
// Create a hotel
router.patch(
  "/update-hotel/:hotel_id",
  authenticateJWT,
  requireRole(["admin"]),
  updateHotel
);
// Update a hotel
router.delete(
  "/delete-hotel/:hotel_id",
  authenticateJWT,
  requireRole(["admin"]),
  deleteHotel
);
// Delete a hotel
router.get("/get-all-hotels", getAllHotels); // Get all hotels

router.get(
  "/get-hotel-by-id/:hotel_id",
  authenticateJWT,
  requireRole(["admin"]),
  getHotelById
); // Get a hotel by ID

export default router;
