import pg from "pg"; // Import the entire 'pg' module
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg; // Destructure 'Pool' from the imported module

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URI,
});

pool.on("error", (err) => {
  console.error("Error connecting to the database:", err);
});

export default pool;
