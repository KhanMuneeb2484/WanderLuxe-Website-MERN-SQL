import pool from "../config/db.js";

// Create a new hotel
const registerHotel = async (req, res) => {
  const {
    hotel_name,
    city_id,
    room_type,
    price,
    amenities,
    availability,
    number_of_rooms,
  } = req.body;

  try {
    const newHotelQuery = await pool.query(
      `INSERT INTO hotels (hotel_name, city_id, room_type, price, amenities, availability, number_of_rooms)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        hotel_name,
        city_id,
        room_type,
        price,
        amenities,
        availability,
        number_of_rooms,
      ]
    );

    res.status(201).json({
      message: "Hotel created successfully",
      hotel: newHotelQuery.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating hotel", error });
  }
};

// Update a hotel (supports updating one or multiple fields)
const updateHotel = async (req, res) => {
  const { hotel_id } = req.params;
  const {
    hotel_name,
    city_id,
    room_type,
    price,
    amenities,
    availability,
    number_of_rooms,
  } = req.body;

  try {
    const updates = [];
    const values = [];

    if (hotel_name) {
      updates.push(`hotel_name = $${updates.length + 1}`);
      values.push(hotel_name);
    }
    if (city_id) {
      updates.push(`city_id = $${updates.length + 1}`);
      values.push(city_id);
    }
    if (room_type) {
      updates.push(`room_type = $${updates.length + 1}`);
      values.push(room_type);
    }
    if (price) {
      updates.push(`price = $${updates.length + 1}`);
      values.push(price);
    }
    if (amenities) {
      updates.push(`amenities = $${updates.length + 1}`);
      values.push(amenities);
    }
    if (availability !== undefined) {
      updates.push(`availability = $${updates.length + 1}`);
      values.push(availability);
    }
    if (number_of_rooms !== undefined) {
      updates.push(`number_of_rooms = $${updates.length + 1}`);
      values.push(number_of_rooms);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(hotel_id);
    const updateQuery = `UPDATE hotels SET ${updates.join(
      ", "
    )} WHERE hotel_id = $${values.length} RETURNING *`;

    const updatedHotelQuery = await pool.query(updateQuery, values);

    if (updatedHotelQuery.rows.length === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json({
      message: "Hotel updated successfully",
      hotel: updatedHotelQuery.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating hotel", error });
  }
};

// Delete a hotel
const deleteHotel = async (req, res) => {
  const { hotel_id } = req.params;

  try {
    const deleteQuery = await pool.query(
      `DELETE FROM hotels WHERE hotel_id = $1 RETURNING *`,
      [hotel_id]
    );

    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting hotel", error });
  }
};

// Get all hotels with associated city names
const getAllHotels = async (req, res) => {
  try {
    const allHotelsQuery = await pool.query(
      `SELECT h.*, c.city_name
       FROM hotels h
       JOIN cities c ON h.city_id = c.city_id`
    );

    res.status(200).json(allHotelsQuery.rows);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ message: "Error fetching hotels", error });
  }
};

// Get a hotel by ID
const getHotelById = async (req, res) => {
  const { hotel_id } = req.params;

  try {
    const hotelQuery = await pool.query(
      `SELECT * FROM hotels WHERE hotel_id = $1`,
      [hotel_id]
    );

    if (hotelQuery.rows.length === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(hotelQuery.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotel", error });
  }
};

// Get hotels by City ID
const getHotelsByCityId = async (req, res) => {
  const { city_id } = req.params;

  try {
    const hotelsQuery = await pool.query(
      `SELECT * FROM hotels WHERE city_id = $1`,
      [city_id]
    );

    if (hotelsQuery.rows.length === 0) {
      return res.status(404).json({ message: "No hotels found in this city" });
    }

    res.status(200).json(hotelsQuery.rows);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ message: "Error fetching hotels", error });
  }
};

export {
  registerHotel,
  updateHotel,
  deleteHotel,
  getAllHotels,
  getHotelById,
  getHotelsByCityId,
};
