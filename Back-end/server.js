const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const morgan = require("morgan");
const pool = require("./config/db");
app.use(express.json());

app.use("/api/users", userRoutes);

app.use(morgan("dev"));

const PORT = process.env.PORT;

(async () => {
  let server;

  try {
    await pool.connect();
    console.log("Connected to DB successfully!");

    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }

  const shutdown = async () => {
    console.log("Shutting down gracefully...");

    if (server) {
      server.close(() => {
        console.log("Server closed.");
      });
    }

    await pool.end();
    console.log("Database connection closed.");

    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
})();
