import express from "express";
import {
  registerLocation,
  deleteLocation,
  updateLocation,
  getAllLocations,
  getLocationById,
  getLocationsByCityId,
} from "../controllers/locationController.js";
import { authenticateJWT, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new location
router.post(
  "/register-location",
  authenticateJWT,
  requireRole(["admin"]),
  registerLocation
);

// Delete a location by ID
router.delete(
  "/delete-location/:location_id",
  authenticateJWT,
  requireRole(["admin"]),
  deleteLocation
);

// Update a location by ID
router.patch(
  "/update-location/:location_id",
  authenticateJWT,
  requireRole(["admin"]),
  updateLocation
);

// Get all locations
router.get("/get-all-locations", getAllLocations);

// Get a location by ID
router.get(
  "/get-location-by-id/:location_id",
  authenticateJWT,
  requireRole(["admin"]),
  getLocationById
);

// Get locations by city ID
router.get("/get-locations-by-cityId/:city_id", getLocationsByCityId);

export default router;
