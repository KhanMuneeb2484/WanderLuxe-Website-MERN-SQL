import express from "express";
import upload from "../middleware/multer.js";
import {
  uploadCountryPicture,
  uploadCityPicture,
  uploadLocationPicture,
  uploadGuidePicture,
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

export default router;
