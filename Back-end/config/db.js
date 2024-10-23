// config/db.js
const { Pool } = require("pg");

// PostgreSQL connection using URI from Supabase
const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URI,
});

module.exports = pool;
