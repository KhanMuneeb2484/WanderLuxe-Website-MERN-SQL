import express from "express";
import { authenticateJWT, requireRole } from "../middleware/authMiddleware.js";
import {
  registerCity,
  getCities,
  getCityById,
  deleteCity,
  updateCity,
} from "../controllers/cityController";
