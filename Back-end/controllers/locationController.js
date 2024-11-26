import pool from "../config/db.js";

// Create a new location
const createLocation = async (req, res) => {
  const { location_name, city_id } = req.body;

  try {
    const newLocation = await pool.query(
      "INSERT INTO locations (location_name, city_id) VALUES ($1, $2) RETURNING *",
      [location_name, city_id]
    );

    res.status(201).json(newLocation.rows[0]);
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a location
const deleteLocation = async (req, res) => {
  const { location_id } = req.params;

  try {
    const location = await pool.query(
      "SELECT * FROM locations WHERE location_id = $1",
      [location_id]
    );

    if (location.rows.length === 0) {
      return res.status(404).json({ message: "Location not found" });
    }

    await pool.query("DELETE FROM locations WHERE location_id = $1", [
      location_id,
    ]);
    res.status(204).json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a location
const updateLocation = async (req, res) => {
  const { location_id } = req.params;
  const { location_name, city_id } = req.body;

  try {
    const location = await pool.query(
      "SELECT * FROM locations WHERE location_id = $1",
      [location_id]
    );

    if (location.rows.length === 0) {
      return res.status(404).json({ message: "Location not found" });
    }

    const updatedLocation = await pool.query(
      "UPDATE locations SET location_name = COALESCE($1, location_name), city_id = COALESCE($2, city_id) WHERE location_id = $3 RETURNING *",
      [location_name, city_id, location_id]
    );

    res.status(200).json(updatedLocation.rows[0]);
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all locations
const getAllLocations = async (req, res) => {
  try {
    const locations = await pool.query("SELECT * FROM locations");

    res.status(200).json(locations.rows);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a location by ID
const getLocationById = async (req, res) => {
  const { location_id } = req.params;

  try {
    const location = await pool.query(
      "SELECT * FROM locations WHERE location_id = $1",
      [location_id]
    );

    if (location.rows.length === 0) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json(location.rows[0]);
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Export all functions
export {
  createLocation,
  deleteLocation,
  updateLocation,
  getAllLocations,
  getLocationById,
};
