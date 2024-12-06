import express from "express";
import {
  createPackage,
  getPackageById,
  deletePackageById,
  getAllPackages,
  getPackageByUserId,
} from "../controllers/packageController.js"; // Updated for ES6 imports
import { authenticateJWT, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a package
router.post("/create-package", authenticateJWT, createPackage);

router.get("/get-package-by-id/:package_id",  getPackageById);

router.delete(
  "/delete-package/:package_id",
  authenticateJWT,
  deletePackageById
);

router.get("/get-all-packages", getAllPackages);

router.get("/get-packages-by-userId", authenticateJWT, getPackageByUserId); // Updated to include user_id parameter

export default router;
