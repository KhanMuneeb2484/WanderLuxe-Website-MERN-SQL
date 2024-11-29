import pool from "../config/db.js";

const createBooking = async (req, res) => {
  const { user_id } = req.user; // Assuming JWT middleware populates req.user
  const { package_id, start_date } = req.body;

  // Validate input
  if (!user_id || !package_id || !start_date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Fetch the total days for the package
    const packageQuery = await pool.query(
      `SELECT 
         SUM(pc.days_stayed) AS total_days 
       FROM package_cities pc
       WHERE pc.package_id = $1`,
      [package_id]
    );

    if (packageQuery.rowCount === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    const totalDays = packageQuery.rows[0].total_days;
    if (!totalDays) {
      return res.status(400).json({
        message: "Total days for the package could not be determined",
      });
    }

    // Calculate the end_date based on start_date and total days
    const endDateQuery = await pool.query(`SELECT $1::DATE + $2 AS end_date`, [
      start_date,
      totalDays,
    ]);
    const end_date = endDateQuery.rows[0].end_date;

    // Insert the booking into the bookings table with status 'pending'
    const bookingQuery = await pool.query(
      `INSERT INTO bookings (user_id, package_id, start_date, end_date, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, package_id, start_date, end_date, "pending"]
    );

    res.status(201).json({
      message: "Booking created successfully",
      booking: bookingQuery.rows[0],
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Error creating booking", error });
  }
};

export { createBooking };
