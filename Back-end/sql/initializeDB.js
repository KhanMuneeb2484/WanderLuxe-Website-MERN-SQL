import fs from "fs";
import path from "path";
import pool from "../config/db.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to check if a table exists
const checkTableExists = async (tableName) => {
  const res = await pool.query(`SELECT to_regclass($1);`, [tableName]);
  return res.rows[0].to_regclass !== null;
};

// Function to initialize the database
const initializeDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    // Split the SQL file into individual statements
    const statements = schema
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt);

    for (const statement of statements) {
      // Extract table name from CREATE TABLE statement
      const match = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/);
      if (match) {
        const tableName = match[1];
        const exists = await checkTableExists(tableName);
        if (!exists) {
          await pool.query(statement);
          console.log(`Table '${tableName}' created.`);
        } else {
          console.log(`Table '${tableName}' already exists.`);
        }
      } else {
        // Execute other SQL statements (like INSERT, UPDATE)
        await pool.query(statement);
      }
    }

    console.log("Database initialization complete.");
  } catch (error) {
    console.error("Error initializing database:", error);
    console.error("Error details:", error.detail); // Log error details
  }
};

// Main function to check and initialize the database
const checkAndInitializeDB = async () => {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error("Error checking database:", error);
    console.error("Error details:", error.detail); // Log error details
  }
};

export default checkAndInitializeDB;
