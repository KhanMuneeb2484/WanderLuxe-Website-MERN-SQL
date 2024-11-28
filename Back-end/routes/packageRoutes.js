import express from "express";
import {
  createPackage,
  getPackageById,
} from "../controllers/packageController.js"; // Updated for ES6 imports
import { authenticateJWT, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a package
router.post("/create-package", authenticateJWT, createPackage);

router.get("/get-package-by-id/:package_id", getPackageById);

export default router;
