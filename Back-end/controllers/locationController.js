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

// Get all locations with associated city names and location pictures
const getAllLocations = async (req, res) => {
  try {
    const locationsQuery = await pool.query(
      `SELECT l.*, c.city_name 
       FROM locations l
       JOIN cities c ON l.city_id = c.city_id`
    );

    const locations = locationsQuery.rows;

    // Fetch pictures for each location and merge with the location data
    for (const location of locations) {
      const pictureQuery = await pool.query(
        "SELECT picture_url, alt_text FROM location_pictures WHERE location_id = $1",
        [location.location_id]
      );

      // Append picture details directly to the location object
      if (pictureQuery.rows.length > 0) {
        location.picture_url = pictureQuery.rows[0].picture_url;
        location.alt_text = pictureQuery.rows[0].alt_text;
      }
    }

    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a location by ID with associated city name and location pictures
const getLocationById = async (req, res) => {
  const { location_id } = req.params;

  try {
    // Fetch the location by ID
    const locationQuery = await pool.query(
      "SELECT * FROM locations WHERE location_id = $1",
      [location_id]
    );

    if (locationQuery.rows.length === 0) {
      return res.status(404).json({ message: "Location not found" });
    }

    const location = locationQuery.rows[0];

    // Fetch the associated city name
    const cityQuery = await pool.query(
      "SELECT city_name FROM cities WHERE city_id = $1",
      [location.city_id]
    );
    location.city_name = cityQuery.rows[0].city_name;

    // Fetch pictures for the location and merge with the location data
    const pictureQuery = await pool.query(
      "SELECT picture_url, alt_text FROM location_pictures WHERE location_id = $1",
      [location.location_id]
    );

    if (pictureQuery.rows.length > 0) {
      location.picture_url = pictureQuery.rows[0].picture_url;
      location.alt_text = pictureQuery.rows[0].alt_text;
    }

    res.status(200).json(location);
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get locations by city ID with associated pictures
const getLocationsByCityId = async (req, res) => {
  const { city_id } = req.params;

  try {
    // Fetch locations by city ID
    const locationsQuery = await pool.query(
      "SELECT * FROM locations WHERE city_id = $1",
      [city_id]
    );

    if (locationsQuery.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No locations found for this city" });
    }

    const locations = locationsQuery.rows;

    // Fetch pictures for each location and merge with the location data
    for (const location of locations) {
      const pictureQuery = await pool.query(
        "SELECT picture_url, alt_text FROM location_pictures WHERE location_id = $1",
        [location.location_id]
      );

      if (pictureQuery.rows.length > 0) {
        location.picture_url = pictureQuery.rows[0].picture_url;
        location.alt_text = pictureQuery.rows[0].alt_text;
      }
    }

    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Handle image upload for location pictures
const uploadLocationPicture = async (req, res) => {
  const { location_id } = req.params;
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Save the image URL and alt text to the database
    const pictureUrl = `/uploads/locations/${file.filename}`; // Path to the uploaded image
    const altText = req.body.alt_text || "Location picture";

    const insertQuery = await pool.query(
      "INSERT INTO location_pictures (location_id, picture_url, alt_text) VALUES ($1, $2, $3) RETURNING *",
      [location_id, pictureUrl, altText]
    );

    res
      .status(200)
      .json({
        message: "Image uploaded successfully",
        picture_url: insertQuery.rows[0].picture_url,
        alt_text: insertQuery.rows[0].alt_text,
      });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Handle image update for location pictures
const updateLocationPicture = async (req, res) => {
  const { location_id } = req.params;
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Update the image URL in the database
    const pictureUrl = `/uploads/locations/${file.filename}`; // Path to the uploaded image
    const altText = req.body.alt_text || "Updated location picture";

    const updateQuery = await pool.query(
      "UPDATE location_pictures SET picture_url = $1, alt_text = $2 WHERE location_id = $3 RETURNING *",
      [pictureUrl, altText, location_id]
    );

    res
      .status(200)
      .json({
        message: "Image updated successfully",
        picture_url: updateQuery.rows[0].picture_url,
        alt_text: updateQuery.rows[0].alt_text,
      });
  } catch (error) {
    console.error("Error updating image:", error);
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
