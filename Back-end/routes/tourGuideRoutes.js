import express from "express";
import {
  registerTourGuide,
  updateTourGuide,
  deleteTourGuide,
  getAllTourGuides,
  getTourGuideById,
} from "../controllers/tourGuideController.js";
import { authenticateJWT, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register-guide",
  authenticateJWT,
  requireRole(["admin"]),
  registerTourGuide
); // Create a tour guide
router.patch(
  "/update-guide/:guide_id",
  authenticateJWT,
  requireRole(["admin"]),
  updateTourGuide
); // Update a tour guide
router.delete(
  "/delete-guide/:guide_id",
  authenticateJWT,
  requireRole(["admin"]),
  deleteTourGuide
); // Delete a tour guide
router.get("/get-all-guides", getAllTourGuides); // Get all tour guides
router.get(
  "/get-guide-by-id/:guide_id",
  authenticateJWT,
  requireRole(["admin"]),
  getTourGuideById
); // Get a tour guide by ID

export default router;
