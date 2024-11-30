import express from "express";
import upload from "../middleware/multer.js";
import {
  uploadCountryPicture,
  uploadCityPicture,
  uploadLocationPicture,
  uploadGuidePicture,
  uploadHotelPicture, // Add route for uploading hotel pictures here
} from "../controllers/pictureController.js";

const router = express.Router();

// Routes for uploading pictures
router.post(
  "/upload/country/:country_id",
  upload.single("image"),
  uploadCountryPicture
);

router.post("/upload/city/:city_id", upload.single("image"), uploadCityPicture);

router.post(
  "/upload/location/:location_id",
  upload.single("image"),
  uploadLocationPicture
);

router.post(
  "/upload/guide/:guide_id",
  upload.single("image"),
  uploadGuidePicture
);

// Route to upload hotel pictures
router.post(
  "/upload/hotel/:hotel_id",
  upload.single("image"), // Use multer middleware for single file upload
  uploadHotelPicture
);

export default router;
