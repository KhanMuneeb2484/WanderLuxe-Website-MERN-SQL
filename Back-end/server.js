import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import pool from "./config/db.js";
import dotenv from "dotenv";
import checkAndInitializeDB from "./sql/initializeDB.js";
import countryRoutes from "./routes/countryRoutes.js";
import cityRoutes from "./routes/cityRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import tourGuideRoutes from "./routes/tourGuideRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import customBookingRoutes from "./routes/customBookingRoutes.js";
import pictureRoutes from "./routes/pictureRoutes.js";
import adminPackageRoutes from "./routes/adminPackageRoute.js";
import cors from "cors";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Emulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api/users", userRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/guides", tourGuideRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/bookings", customBookingRoutes);
app.use("/api/adminPackages", adminPackageRoutes);
app.use("/api/pictures", pictureRoutes);

app.use(morgan("dev"));
app.use(express.json());
// Serve static files (uploaded images)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../Front-end/public/uploads"))
);

// Error handling middleware for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
});
await checkAndInitializeDB();

const PORT = process.env.PORT;

pool
  .connect()
  .then((client) => {
    app.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT} and Database is connected`
      );
    });
    client.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the application if database connection fails
  });
