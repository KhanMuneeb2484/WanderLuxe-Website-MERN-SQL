import pool from "../config/db.js";

// Reusable function to insert or update a picture
const upsertPicture = async (table, column, id, pictureUrl, altText, res) => {
  try {
    // First, try to find if the picture already exists
    const checkExistingQuery = `
      SELECT * FROM ${table} WHERE ${column} = $1
    `;
    const checkResult = await pool.query(checkExistingQuery, [id]);

    if (checkResult.rowCount > 0) {
      // If picture exists, update the existing record
      const updateQuery = `
        UPDATE ${table}
        SET picture_url = $1, alt_text = $2
        WHERE ${column} = $3
        RETURNING *;
      `;
      const updateResult = await pool.query(updateQuery, [
        pictureUrl,
        altText,
        id,
      ]);
      res.status(200).json({
        message: "Picture updated successfully",
        data: updateResult.rows[0],
      });
    } else {
      // If picture does not exist, insert a new one
      const insertQuery = `
        INSERT INTO ${table} (${column}, picture_url, alt_text)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const insertResult = await pool.query(insertQuery, [
        id,
        pictureUrl,
        altText,
      ]);
      res.status(201).json({
        message: "Picture added successfully",
        data: insertResult.rows[0],
      });
    }
  } catch (error) {
    console.error(`Error adding/updating picture for ${table}:`, error);
    res.status(500).json({ message: "Error adding/updating picture", error });
  }
};

// Upload picture for a country
export const uploadCountryPicture = async (req, res) => {
  const { country_id } = req.params;
  const altText = req.body.altText || null;
  const pictureUrl = `/uploads/${req.file.filename}`;
  await upsertPicture(
    "country_pictures",
    "country_id",
    country_id,
    pictureUrl,
    altText,
    res
  );
};

// Upload picture for a city
export const uploadCityPicture = async (req, res) => {
  const { city_id } = req.params;
  const altText = req.body.altText || null;
  const pictureUrl = `/uploads/${req.file.filename}`;
  await upsertPicture(
    "city_pictures",
    "city_id",
    city_id,
    pictureUrl,
    altText,
    res
  );
};

// Upload picture for a location
export const uploadLocationPicture = async (req, res) => {
  const { location_id } = req.params;
  const altText = req.body.altText || null;
  const pictureUrl = `/uploads/${req.file.filename}`;
  await upsertPicture(
    "location_pictures",
    "location_id",
    location_id,
    pictureUrl,
    altText,
    res
  );
};

// Upload picture for a tour guide
export const uploadGuidePicture = async (req, res) => {
  const { guide_id } = req.params;
  const altText = req.body.altText || null;
  const pictureUrl = `/uploads/${req.file.filename}`;
  await upsertPicture(
    "guide_pictures",
    "guide_id",
    guide_id,
    pictureUrl,
    altText,
    res
  );
};

// Upload picture for a hotel
export const uploadHotelPicture = async (req, res) => {
  const { hotel_id } = req.params;
  const altText = req.body.altText || null;
  const pictureUrl = `/uploads/${req.file.filename}`;
  await upsertPicture(
    "hotel_pictures",
    "hotel_id",
    hotel_id,
    pictureUrl,
    altText,
    res
  );
};
