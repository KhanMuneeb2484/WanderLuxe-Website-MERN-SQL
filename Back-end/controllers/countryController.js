import pool from "../config/db.js";

// Create a new country
const registerCountry = async (req, res) => {
  const { country_name, country_continent } = req.body;

  if (!country_name || !country_continent) {
    return res
      .status(400)
      .json({ message: "Country name and continent are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO countries (country_name, country_continent) VALUES ($1, $2) RETURNING *",
      [country_name, country_continent]
    );

    const newCountry = result.rows[0];
    res.status(201).json(newCountry);
  } catch (error) {
    console.error("Error creating country:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a country by ID
const deleteCountry = async (req, res) => {
  const { country_id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM countries WHERE country_id = $1 RETURNING *",
      [country_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.status(200).json({ message: "Country deleted successfully" });
  } catch (error) {
    console.error("Error deleting country:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all countries with pictures
const getAllCountries = async (req, res) => {
  try {
    // Query to get all countries along with their pictures
    const result = await pool.query(`
      SELECT c.*, cp.picture_url, cp.alt_text
      FROM countries c
      LEFT JOIN country_pictures cp ON c.country_id = cp.country_id
    `);

    if (result.rowCount === 0) {
      return res
        .status(200)
        .json({ message: "No countries found", countries: [] });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get country by ID with pictures
const getCountryById = async (req, res) => {
  const { country_id } = req.params;

  try {
    // Query to get country by ID along with its picture
    const result = await pool.query(
      `
      SELECT c.*, cp.picture_url, cp.alt_text
      FROM countries c
      LEFT JOIN country_pictures cp ON c.country_id = cp.country_id
      WHERE c.country_id = $1
    `,
      [country_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching country:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update country
const updateCountry = async (req, res) => {
  const { country_id } = req.params;
  const { country_name, country_continent } = req.body;

  try {
    // Check if the country exists
    const countryQuery = await pool.query(
      "SELECT * FROM countries WHERE country_id = $1",
      [country_id]
    );

    if (countryQuery.rows.length === 0) {
      return res.status(404).json({ message: "Country not found" });
    }

    // Prepare dynamic SET clause for fields to update
    const updates = [];
    const values = [];

    if (country_name) {
      updates.push(`country_name = $${updates.length + 1}`);
      values.push(country_name);
    }
    if (country_continent) {
      updates.push(`country_continent = $${updates.length + 1}`);
      values.push(country_continent);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Add countryId as the final parameter for the WHERE clause
    values.push(country_id);

    // Build and execute the update query
    const updateQuery = `UPDATE countries SET ${updates.join(
      ", "
    )} WHERE country_id = $${values.length} RETURNING *`;

    const updatedCountryQuery = await pool.query(updateQuery, values);
    const updatedCountry = updatedCountryQuery.rows[0];

    res.json(updatedCountry);
  } catch (error) {
    console.error("Error updating country:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export {
  registerCountry,
  deleteCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
};
