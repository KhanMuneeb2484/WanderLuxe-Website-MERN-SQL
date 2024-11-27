import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import pool from "./config/db.js"; // Adjust if you're using CommonJS
import dotenv from "dotenv";
import checkAndInitializeDB from "./sql/initializeDB.js";
import countryRoutes from "./routes/countryRoutes.js";
import cityRoutes from "./routes/cityRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import tourGuideRoutes from "./routes/tourGuideRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/guides", tourGuideRoutes);

app.use(morgan("dev"));

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
