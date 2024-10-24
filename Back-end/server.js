import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js"; // Assuming you're using ES6 module syntax
import pool from "./config/db.js"; // Adjust if you're using CommonJS
import dotenv from "dotenv";
import checkAndInitializeDB from "./sql/initializeDB.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

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
