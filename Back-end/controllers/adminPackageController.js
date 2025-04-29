import pool from "../config/db.js";

const createPackage = async (req, res) => {
  const { user_id } = req.user; // Assuming JWT middleware populates req.user
  const { country_id, guide_id, cities, num_people } = req.body;

  // Ensure that user_id and num_people are present
  if (!user_id || !num_people) {
    return res
      .status(400)
      .json({ message: "User ID and number of people are required" });
  }

  console.log("Request body:", req.body); // Log incoming request data

  try {
    // Ensure cities is an array
    if (!Array.isArray(cities) || cities.length === 0) {
      return res.status(400).json({ message: "Cities data is required" });
    }

    // Calculate total days stayed
    let totalDaysStayed = 0; // Initialize the totalDaysStayed
    for (const city of cities) {
      const { city_id, days_stayed, locations, hotels } = city;

      // Validate city_id, locations, and hotels data
      if (!city_id || !days_stayed) {
        return res.status(400).json({ message: "Missing city details" });
      }

      // Add the days_stayed for the current city to totalDaysStayed
      totalDaysStayed += days_stayed;
    }

    if (totalDaysStayed <= 0) {
      return res
        .status(400)
        .json({ message: "Total days stayed must be greater than 0" });
    }

    // Insert into adminPackages table with initial total_price of 0 and num_people
    const newPackageQuery = await pool.query(
      `INSERT INTO adminPackages (user_id, country_id, guide_id, total_price, num_people, total_days_stayed)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, country_id, guide_id || null, 0, num_people, totalDaysStayed]
    );
    const package_id = newPackageQuery.rows[0].package_id;

    let totalPrice = 0;

    for (const city of cities) {
      const { city_id, days_stayed, locations, hotels } = city;

      // Validate city_id, locations, and hotels data
      if (!city_id || !days_stayed) {
        return res.status(400).json({ message: "Missing city details" });
      }

      // Insert city into admin_package_cities with initial city_cost of 0
      const cityResult = await pool.query(
        `INSERT INTO admin_package_cities (package_id, city_id, days_stayed, city_cost)
         VALUES ($1, $2, $3, $4) RETURNING package_city_id`,
        [package_id, city_id, days_stayed, 0]
      );
      const packageCityId = cityResult.rows[0].package_city_id;

      let cityCost = 0;

      // Process locations for the city and calculate cost
      if (Array.isArray(locations) && locations.length > 0) {
        for (const location of locations) {
          const { location_id } = location;

          if (!location_id) {
            return res
              .status(400)
              .json({ message: "Invalid location details" });
          }

          const locationData = await pool.query(
            `SELECT price_per_person FROM locations WHERE location_id = $1`,
            [location_id]
          );
          if (
            locationData.rowCount === 0 ||
            locationData.rows[0].price_per_person === null
          ) {
            throw new Error(
              `Location with ID ${location_id} has no price data.`
            );
          }

          const locationPrice =
            locationData.rows[0].price_per_person * num_people;
          cityCost += locationPrice;

          await pool.query(
            `INSERT INTO admin_package_locations (package_city_id, location_id, total_price)
             VALUES ($1, $2, $3)`,
            [packageCityId, location_id, locationPrice]
          );
        }
      }

      // Process hotels for the city and calculate cost
      if (Array.isArray(hotels) && hotels.length > 0) {
        for (const hotel of hotels) {
          const { hotel_id, num_rooms } = hotel;

          if (!hotel_id || !num_rooms) {
            return res.status(400).json({ message: "Invalid hotel details" });
          }

          const hotelData = await pool.query(
            `SELECT price FROM hotels WHERE hotel_id = $1`,
            [hotel_id]
          );
          if (hotelData.rowCount === 0 || hotelData.rows[0].price === null) {
            throw new Error(`Hotel with ID ${hotel_id} has no price data.`);
          }

          const hotelPrice = hotelData.rows[0].price * num_rooms * days_stayed;
          cityCost += hotelPrice;

          await pool.query(
            `INSERT INTO admin_package_hotels (package_city_id, hotel_id, num_rooms, hotel_cost, days_stayed)
             VALUES ($1, $2, $3, $4, $5)`,
            [packageCityId, hotel_id, num_rooms, hotelPrice, days_stayed]
          );
        }
      }

      await pool.query(
        `UPDATE admin_package_cities SET city_cost = $1 WHERE package_city_id = $2`,
        [cityCost, packageCityId]
      );

      totalPrice += cityCost;
    }

    let guideCost = 0;
    if (guide_id) {
      const guideData = await pool.query(
        `SELECT per_day_charge FROM tour_guides WHERE guide_id = $1`,
        [guide_id]
      );
      if (
        guideData.rowCount === 0 ||
        guideData.rows[0].per_day_charge === null
      ) {
        throw new Error("Tour guide not found or guide charge is missing.");
      }

      guideCost = guideData.rows[0].per_day_charge * totalDaysStayed;
      totalPrice += guideCost;
    }

    const updatePackage = await pool.query(
      `UPDATE adminPackages SET total_price = $1, guide_cost = $2, total_days_stayed = $3 WHERE package_id = $4 RETURNING *`,
      [totalPrice, guideCost, totalDaysStayed, package_id]
    );

    res.status(201).json({
      message: "Tour package created successfully",
      tour_package: updatePackage.rows[0],
    });
  } catch (error) {
    console.error("Error creating tour package:", error);
    res.status(500).json({ message: "Error creating tour package", error });
  }
};

// Get package details by ID
// Get package by ID
const getPackageById = async (req, res) => {
  const { package_id } = req.params;

  if (isNaN(package_id)) {
    return res.status(400).json({ message: "Invalid package ID" });
  }

  try {
    // Fetch package details by package_id from admin tables
    const packageQuery = await pool.query(
      `
      SELECT 
        p.package_id,
        p.user_id,
        p.country_id,
        p.guide_id,
        p.total_price,
        p.num_people,
        p.total_days_stayed,
        c.country_name,
        g.guide_name,
        g.per_day_charge,
        cp.picture_url AS country_picture
      FROM adminPackages p
      LEFT JOIN countries c ON p.country_id = c.country_id
      LEFT JOIN tour_guides g ON p.guide_id = g.guide_id
      LEFT JOIN country_pictures cp ON c.country_id = cp.country_id
      WHERE p.package_id = $1
      `,
      [package_id]
    );

    if (packageQuery.rows.length === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    const pkg = packageQuery.rows[0];

    // Fetch cities associated with the package from admin tables
    const citiesQuery = await pool.query(
      `
      SELECT 
        pc.package_city_id,
        pc.city_id,
        pc.days_stayed,
        pc.city_cost,
        ci.city_name,
        cpic.picture_url AS city_picture
      FROM admin_package_cities pc
      LEFT JOIN cities ci ON pc.city_id = ci.city_id
      LEFT JOIN city_pictures cpic ON ci.city_id = cpic.city_id
      WHERE pc.package_id = $1
      `,
      [package_id]
    );

    const cities = citiesQuery.rows;

    for (const city of cities) {
      const { package_city_id } = city;

      // Locations
      const locationsQuery = await pool.query(
        `
        SELECT 
          pl.location_id,
          l.location_name,
          pl.total_price AS location_price,
          lp.picture_url AS location_picture
        FROM admin_package_locations pl
        LEFT JOIN locations l ON pl.location_id = l.location_id
        LEFT JOIN location_pictures lp ON l.location_id = lp.location_id
        WHERE pl.package_city_id = $1
        `,
        [package_city_id]
      );
      city.locations = locationsQuery.rows;

      // Hotels
      const hotelsQuery = await pool.query(
        `
        SELECT 
          ph.hotel_id,
          h.hotel_name,
          ph.num_rooms,
          ph.hotel_cost,
          ph.days_stayed,
          hp.picture_url AS hotel_picture
        FROM admin_package_hotels ph
        LEFT JOIN hotels h ON ph.hotel_id = h.hotel_id
        LEFT JOIN hotel_pictures hp ON h.hotel_id = hp.hotel_id
        WHERE ph.package_city_id = $1
        `,
        [package_city_id]
      );
      city.hotels = hotelsQuery.rows;
    }

    pkg.cities = cities;

    // Construct the response for the admin package
    const adminPackage = {
      package_id: pkg.package_id,
      user_id: pkg.user_id,
      country_id: pkg.country_id,
      guide_id: pkg.guide_id,
      total_price: pkg.total_price,
      num_people: pkg.num_people,
      total_days_stayed: pkg.total_days_stayed,
      country_name: pkg.country_name,
      guide_name: pkg.guide_name,
      per_day_charge: pkg.per_day_charge,
      country_picture: pkg.country_picture,
      cities: pkg.cities,
    };

    res.status(200).json({
      message: "Package retrieved successfully",
      adminPackages: [adminPackage], // wrap the package in an array like the backend response
    });
  } catch (error) {
    console.error("Error fetching package by ID:", error);
    res.status(500).json({ message: "Error fetching package by ID", error });
  }
};



// Delete a package by ID
const deletePackageById = async (req, res) => {
  const { package_id } = req.params; // Get package_id from route parameters

  try {
    // Check if the package exists
    const packageExists = await pool.query(
      `SELECT * FROM adminPackages WHERE package_id = $1`,
      [package_id]
    );

    if (packageExists.rowCount === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Start a transaction to ensure consistent deletion
    await pool.query("BEGIN");

    // Delete related data from admin_package_locations
    await pool.query(
      `DELETE FROM admin_package_locations
       WHERE package_city_id IN (
         SELECT package_city_id FROM admin_package_cities WHERE package_id = $1
       )`,
      [package_id]
    );

    // Delete related data from admin_package_hotels
    await pool.query(
      `DELETE FROM admin_package_hotels
       WHERE package_city_id IN (
         SELECT package_city_id FROM admin_package_cities WHERE package_id = $1
       )`,
      [package_id]
    );

    // Delete related data from admin_package_cities
    await pool.query(`DELETE FROM admin_package_cities WHERE package_id = $1`, [
      package_id,
    ]);

    // Finally, delete the package itself
    await pool.query(`DELETE FROM adminPackages WHERE package_id = $1`, [
      package_id,
    ]);

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    // Rollback the transaction in case of an error
    await pool.query("ROLLBACK");
    console.error("Error deleting package:", error);
    res.status(500).json({ message: "Error deleting package", error });
  }
};

// Get all tour adminPackages
const getAllPackages = async (req, res) => {
  try {
    // Fetch all adminPackages with related basic info
    const packageQuery = await pool.query(`
      SELECT 
        p.package_id,
        p.user_id,
        p.country_id,
        p.guide_id,
        p.total_price,
        p.num_people,
        p.total_days_stayed,
        c.country_name,
        g.guide_name,
        g.per_day_charge,
        cp.picture_url AS country_picture
      FROM adminPackages p
      LEFT JOIN countries c ON p.country_id = c.country_id
      LEFT JOIN tour_guides g ON p.guide_id = g.guide_id
      LEFT JOIN country_pictures cp ON c.country_id = cp.country_id
    `);

    const adminPackages = packageQuery.rows;

    if (adminPackages.length === 0) {
      return res.status(200).json({ message: "No adminPackages found", adminPackages: [] });
    }

    for (const pkg of adminPackages) {
      const { package_id } = pkg;

      // Fetch cities in the package
      const citiesQuery = await pool.query(`
        SELECT 
          pc.package_city_id,
          pc.city_id,
          pc.days_stayed,
          pc.city_cost,
          ci.city_name,
          cpic.picture_url AS city_picture
        FROM admin_package_cities pc
        LEFT JOIN cities ci ON pc.city_id = ci.city_id
        LEFT JOIN city_pictures cpic ON ci.city_id = cpic.city_id
        WHERE pc.package_id = $1
      `, [package_id]);

      const cities = citiesQuery.rows;

      for (const city of cities) {
        const { package_city_id } = city;

        // Fetch locations for this city
        const locationsQuery = await pool.query(`
          SELECT 
            pl.location_id,
            l.location_name,
            pl.total_price AS location_price,
            lp.picture_url AS location_picture
          FROM admin_package_locations pl
          LEFT JOIN locations l ON pl.location_id = l.location_id
          LEFT JOIN location_pictures lp ON l.location_id = lp.location_id
          WHERE pl.package_city_id = $1
        `, [package_city_id]);

        city.locations = locationsQuery.rows;

        // Fetch hotels for this city
        const hotelsQuery = await pool.query(`
          SELECT 
            ph.hotel_id,
            h.hotel_name,
            ph.num_rooms,
            ph.hotel_cost,
            ph.days_stayed,
            hp.picture_url AS hotel_picture
          FROM admin_package_hotels ph
          LEFT JOIN hotels h ON ph.hotel_id = h.hotel_id
          LEFT JOIN hotel_pictures hp ON h.hotel_id = hp.hotel_id
          WHERE ph.package_city_id = $1
        `, [package_city_id]);

        city.hotels = hotelsQuery.rows;
      }

      pkg.cities = cities;
    }

    res.status(200).json({
      message: "Packages retrieved successfully",
      adminPackages
    });
  } catch (error) {
    console.error("Error fetching adminPackages:", error);
    res.status(500).json({
      message: "Error fetching adminPackages",
      error: error.message
    });
  }
};


export { createPackage, getPackageById, deletePackageById, getAllPackages };
