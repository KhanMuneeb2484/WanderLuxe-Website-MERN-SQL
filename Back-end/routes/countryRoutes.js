import { authenticateJWT, requireRole } from "../middleware/authMiddleware.js";
import express from "express";
import {
  registerCountry,
  getCountries,
  getCountryById,
  deleteCountry,
  updateCountry,
} from "../controllers/countryController.js";

const router = express.Router();

// Register a new country
router.post(
  "/register-country",
  authenticateJWT,
  requireRole(["admin"]),
  registerCountry
);

// Get all countries
router.get("/get-all-countries", authenticateJWT, getCountries);

// Get country by ID
router.get("/get-country-by-id/:country_id", authenticateJWT, getCountryById);

//Delete country by ID
router.delete(
  "/delete-country/:country_id",
  authenticateJWT,
  requireRole(["admin"]),
  deleteCountry
);

//update country
router.get(
  "/update-country/:country_id",
  authenticateJWT,
  requireRole(["admin"]),
  updateCountry
);

export default router;
