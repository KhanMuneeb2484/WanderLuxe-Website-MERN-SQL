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

router.post("/register-hotel", registerHotel); // Create a hotel
router.patch("/update-hotel/:hotel_id", updateHotel); // Update a hotel
router.delete("/delete-hotel/:hotel_id", deleteHotel); // Delete a hotel
router.get("/get-all-hotels", getAllHotels); // Get all hotels
router.get("/get-hotel-by-id/:hotel_id", getHotelById); // Get a hotel by ID

export default router;
