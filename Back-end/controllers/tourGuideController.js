import pool from "../config/db.js";
import { authenticateJWT, requireRole } from "../middleware/authMiddleware.js";

// Create a new tour guide
const registerTourGuide = async (req, res) => {
  const {
    guide_name,
    country_id,
    expertise,
    rating,
    per_day_charge,
    availability,
  } = req.body;

  try {
    const newGuideQuery = await pool.query(
      `INSERT INTO tour_guides (guide_name, country_id, expertise, rating, per_day_charge, availability)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [guide_name, country_id, expertise, rating, per_day_charge, availability]
    );

    res.status(201).json({
      message: "Tour guide created successfully",
      tour_guide: newGuideQuery.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating tour guide", error });
  }
};

// Update a tour guide (supports updating one or multiple fields)
const updateTourGuide = async (req, res) => {
  const { guide_id } = req.params;
  const {
    guide_name,
    country_id,
    expertise,
    rating,
    per_day_charge,
    availability,
  } = req.body;

  try {
    const updates = [];
    const values = [];

    if (guide_name) {
      updates.push(`guide_name = $${updates.length + 1}`);
      values.push(guide_name);
    }
    if (country_id) {
      updates.push(`country_id = $${updates.length + 1}`);
      values.push(country_id);
    }
    if (expertise) {
      updates.push(`expertise = $${updates.length + 1}`);
      values.push(expertise);
    }
    if (rating) {
      updates.push(`rating = $${updates.length + 1}`);
      values.push(rating);
    }
    if (per_day_charge) {
      updates.push(`per_day_charge = $${updates.length + 1}`);
      values.push(per_day_charge);
    }
    if (availability !== undefined) {
      updates.push(`availability = $${updates.length + 1}`);
      values.push(availability);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(guide_id);
    const updateQuery = `UPDATE tour_guides SET ${updates.join(
      ", "
    )} WHERE guide_id = $${values.length} RETURNING *`;

    const updatedGuideQuery = await pool.query(updateQuery, values);

    if (updatedGuideQuery.rows.length === 0) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    res.status(200).json({
      message: "Tour guide updated successfully",
      tour_guide: updatedGuideQuery.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating tour guide", error });
  }
};

// Delete a tour guide
const deleteTourGuide = async (req, res) => {
  const { guide_id } = req.params;

  try {
    const deleteQuery = await pool.query(
      `DELETE FROM tour_guides WHERE guide_id = $1 RETURNING *`,
      [guide_id]
    );

    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    res.status(200).json({ message: "Tour guide deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tour guide", error });
  }
};

// Get all tour guides
const getAllTourGuides = async (req, res) => {
  try {
    const allGuidesQuery = await pool.query("SELECT * FROM tour_guides");
    res.status(200).json(allGuidesQuery.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tour guides", error });
  }
};

// Get a tour guide by ID
const getTourGuideById = async (req, res) => {
  const { guide_id } = req.params;

  try {
    const guideQuery = await pool.query(
      `SELECT * FROM tour_guides WHERE guide_id = $1`,
      [guide_id]
    );

    if (guideQuery.rows.length === 0) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    res.status(200).json(guideQuery.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tour guide", error });
  }
};

// Get tour guides by Country ID
const getTourGuidesByCountryId = async (req, res) => {
  const { country_id } = req.params;

  try {
    const guidesQuery = await pool.query(
      `SELECT * FROM tour_guides WHERE country_id = $1`,
      [country_id]
    );

    if (guidesQuery.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No tour guides found for this country" });
    }

    res.status(200).json(guidesQuery.rows);
  } catch (error) {
    console.error("Error fetching tour guides:", error);
    res.status(500).json({ message: "Error fetching tour guides", error });
  }
};

export {
  registerTourGuide,
  updateTourGuide,
  deleteTourGuide,
  getAllTourGuides,
  getTourGuideById,
  getTourGuidesByCountryId,
};
