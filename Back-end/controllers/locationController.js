import pool from "../config/db.js";

// Create a new location
const registerLocation = async (req, res) => {
  const { location_name, city_id, price_per_person } = req.body;

  if (!price_per_person || price_per_person <= 0) {
    return res.status(400).json({
      message: "Price per person is required and must be greater than 0.",
    });
  }

  try {
    const newLocation = await pool.query(
      "INSERT INTO locations (location_name, price_per_person, city_id) VALUES ($1, $2, $3) RETURNING *",
      [location_name, price_per_person, city_id]
    );

    res.status(201).json({
      message: "Location registered successfully",
      location: newLocation.rows[0],
    });
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
    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a location
const updateLocation = async (req, res) => {
  const { location_id } = req.params;
  const updates = req.body; // Dynamic updates from request body

  try {
    // Check if the location exists
    const location = await pool.query(
      "SELECT * FROM locations WHERE location_id = $1",
      [location_id]
    );

    if (location.rows.length === 0) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Prepare dynamic SQL query for updating
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    values.push(location_id); // Add the location_id as the last parameter
    const query = `
        UPDATE locations 
        SET ${fields.join(", ")} 
        WHERE location_id = $${index} 
        RETURNING *`;

    const updatedLocation = await pool.query(query, values);

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

// Get locations by city ID
const getLocationsByCityId = async (req, res) => {
  const { city_id } = req.params;

  try {
    const locations = await pool.query(
      "SELECT * FROM locations WHERE city_id = $1",
      [city_id]
    );

    if (locations.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No locations found for this city" });
    }

    res.status(200).json(locations.rows);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Export all functions
export {
  registerLocation,
  deleteLocation,
  updateLocation,
  getAllLocations,
  getLocationById,
  getLocationsByCityId,
};
