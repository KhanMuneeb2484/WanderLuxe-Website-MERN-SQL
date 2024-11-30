import pool from "../config/db.js";

// Reusable function to insert or update a picture
const upsertPicture = async (table, column, id, pictureUrl, altText, res) => {
  try {
    const query = `
      INSERT INTO ${table} (${column}, picture_url, alt_text)
      VALUES ($1, $2, $3)
      ON CONFLICT (${column})
      DO UPDATE SET 
        picture_url = EXCLUDED.picture_url,
        alt_text = EXCLUDED.alt_text
      RETURNING *;
    `;
    const result = await pool.query(query, [id, pictureUrl, altText]);
    res
      .status(200)
      .json({
        message: "Picture added/updated successfully",
        data: result.rows[0],
      });
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
