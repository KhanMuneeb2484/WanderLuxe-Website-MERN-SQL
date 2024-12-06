import express from "express";
import {
  createPackage,
  getPackageById,
  deletePackageById,
  getAllPackages,
} from "../controllers/adminPackageController.js"; // Updated for ES6 imports
import { authenticateJWT, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a package
router.post("/create-package", authenticateJWT, createPackage);

router.get("/get-package-by-id/:package_id", getPackageById);

router.delete(
  "/delete-package/:package_id",
  authenticateJWT,
  requireRole(["admin"]),
  deletePackageById
);

router.get("/get-all-packages", getAllPackages);

export default router;
