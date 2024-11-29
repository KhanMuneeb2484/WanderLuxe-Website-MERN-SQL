import pool from "../config/db.js";

// Create a new tour package
const createPackage = async (req, res) => {
  const { user_id } = req.user; // Assuming JWT middleware populates req.user
  const { country_id, guide_id, cities } = req.body;

  // Ensure that user_id is present
  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Ensure cities is an array
    if (!Array.isArray(cities) || cities.length === 0) {
      return res.status(400).json({ message: "Cities data is required" });
    }

    // Insert into packages table with initial total_price of 0
    const newPackageQuery = await pool.query(
      `INSERT INTO packages (user_id, country_id, guide_id, total_price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, country_id, guide_id || null, 0] // Start with a price of 0
    );
    const package_id = newPackageQuery.rows[0].package_id;

    let totalPrice = 0;
    console.log("Starting total price:", totalPrice);

    // Iterate over cities to calculate city cost and add to total price
    for (const city of cities) {
      const { city_id, days_stayed, locations, hotels } = city;

      // Validate city_id, locations, and hotels data
      if (!city_id || !days_stayed) {
        return res.status(400).json({ message: "Missing city details" });
      }

      // Insert city into package_cities with initial city_cost of 0
      const cityResult = await pool.query(
        `INSERT INTO package_cities (package_id, city_id, days_stayed, city_cost)
         VALUES ($1, $2, $3, $4) RETURNING package_city_id`,
        [package_id, city_id, days_stayed, 0] // Initialize city cost as 0
      );
      const packageCityId = cityResult.rows[0].package_city_id;

      let cityCost = 0;

      // Process locations for the city and calculate cost
      if (Array.isArray(locations) && locations.length > 0) {
        for (const location of locations) {
          const { location_id, num_people } = location;

          if (!location_id || !num_people) {
            return res
              .status(400)
              .json({ message: "Invalid location details" });
          }

          const locationData = await pool.query(
            `SELECT price_per_person FROM locations WHERE location_id = $1`,
            [location_id]
          );
          if (locationData.rowCount === 0) {
            throw new Error(`Location with ID ${location_id} not found.`);
          }

          const locationPrice =
            locationData.rows[0].price_per_person * num_people;
          console.log(`Location price for city ${city_id}:`, locationPrice);
          cityCost += locationPrice;

          // Insert location details into package_locations
          await pool.query(
            `INSERT INTO package_locations (package_city_id, location_id, total_price)
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
          if (hotelData.rowCount === 0) {
            throw new Error(`Hotel with ID ${hotel_id} not found.`);
          }

          const hotelPrice = hotelData.rows[0].price * num_rooms * days_stayed;
          console.log(`Hotel price for city ${city_id}:`, hotelPrice);
          cityCost += hotelPrice;

          // Insert hotel details into package_hotels
          await pool.query(
            `INSERT INTO package_hotels (package_city_id, hotel_id, num_rooms, hotel_cost, days_stayed)
             VALUES ($1, $2, $3, $4, $5)`,
            [packageCityId, hotel_id, num_rooms, hotelPrice, days_stayed]
          );
        }
      }

      // Update city cost in package_cities
      await pool.query(
        `UPDATE package_cities SET city_cost = $1 WHERE package_city_id = $2`,
        [cityCost, packageCityId]
      );

      // Add city cost to total price
      totalPrice += cityCost;
      console.log(`Total price after city ${city_id}:`, totalPrice);
    }

    // Add guide cost if applicable
    let guideCost = 0;
    if (guide_id) {
      const guideData = await pool.query(
        `SELECT per_day_charge FROM tour_guides WHERE guide_id = $1`,
        [guide_id]
      );
      if (guideData.rowCount === 0) {
        throw new Error("Tour guide not found.");
      }

      // Calculate guide cost: per day charge * total days across cities
      guideCost =
        guideData.rows[0].per_day_charge *
        cities.reduce((sum, city) => sum + city.days_stayed, 0);

      console.log("Guide cost:", guideCost);
      totalPrice += guideCost;
    }

    console.log("Final total price (including guide):", totalPrice);

    // Ensure totalPrice is being updated in the database
    const updatePackage = await pool.query(
      `UPDATE packages SET total_price = $1, guide_cost = $2 WHERE package_id = $3 RETURNING *`,
      [totalPrice, guideCost, package_id]
    );

    console.log("Package after update:", updatePackage.rows[0]);

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
const getPackageById = async (req, res) => {
  const { package_id } = req.params; // Get package_id from route parameter

  try {
    // Retrieve the main package details
    const packageQuery = await pool.query(
      `SELECT * FROM packages WHERE package_id = $1`,
      [package_id]
    );

    if (packageQuery.rowCount === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    const packageDetails = packageQuery.rows[0];

    // Retrieve the cities related to the package
    const citiesQuery = await pool.query(
      `SELECT pc.package_city_id, c.city_name, pc.days_stayed, pc.city_cost
       FROM package_cities pc
       JOIN cities c ON pc.city_id = c.city_id
       WHERE pc.package_id = $1`,
      [package_id]
    );

    // Retrieve the locations for each city in the package
    for (const city of citiesQuery.rows) {
      const locationsQuery = await pool.query(
        `SELECT pl.location_id, l.location_name, pl.total_price
         FROM package_locations pl
         JOIN locations l ON pl.location_id = l.location_id
         WHERE pl.package_city_id = $1`,
        [city.package_city_id]
      );
      city.locations = locationsQuery.rows;
    }

    // Retrieve the hotels for each city in the package
    for (const city of citiesQuery.rows) {
      const hotelsQuery = await pool.query(
        `SELECT ph.hotel_id, h.hotel_name, ph.num_rooms, ph.hotel_cost, ph.days_stayed
         FROM package_hotels ph
         JOIN hotels h ON ph.hotel_id = h.hotel_id
         WHERE ph.package_city_id = $1`,
        [city.package_city_id]
      );
      city.hotels = hotelsQuery.rows;
    }

    // Retrieve the guide details if available
    let guideDetails = null;
    if (packageDetails.guide_id) {
      const guideQuery = await pool.query(
        `SELECT * FROM tour_guides WHERE guide_id = $1`,
        [packageDetails.guide_id]
      );
      if (guideQuery.rowCount > 0) {
        guideDetails = guideQuery.rows[0];
      }
    }

    // Prepare the full package details response
    const fullPackageDetails = {
      package: packageDetails,
      cities: citiesQuery.rows,
      guide: guideDetails, // Include guide details if available
    };

    res.status(200).json(fullPackageDetails);
  } catch (error) {
    console.error("Error retrieving package details:", error);
    res
      .status(500)
      .json({ message: "Error retrieving package details", error });
  }
};

// Delete a package by ID
const deletePackageById = async (req, res) => {
  const { package_id } = req.params; // Get package_id from route parameters

  try {
    // Check if the package exists
    const packageExists = await pool.query(
      `SELECT * FROM packages WHERE package_id = $1`,
      [package_id]
    );

    if (packageExists.rowCount === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Start a transaction to ensure consistent deletion
    await pool.query("BEGIN");

    // Delete related data from package_locations
    await pool.query(
      `DELETE FROM package_locations
       WHERE package_city_id IN (
         SELECT package_city_id FROM package_cities WHERE package_id = $1
       )`,
      [package_id]
    );

    // Delete related data from package_hotels
    await pool.query(
      `DELETE FROM package_hotels
       WHERE package_city_id IN (
         SELECT package_city_id FROM package_cities WHERE package_id = $1
       )`,
      [package_id]
    );

    // Delete related data from package_cities
    await pool.query(`DELETE FROM package_cities WHERE package_id = $1`, [
      package_id,
    ]);

    // Finally, delete the package itself
    await pool.query(`DELETE FROM packages WHERE package_id = $1`, [
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

// Get all tour packages
const getAllPackages = async (req, res) => {
  try {
    // Fetch all packages with their basic details
    const packageQuery = await pool.query(`
      SELECT 
        p.package_id,
        p.user_id,
        p.country_id,
        p.guide_id,
        p.total_price,
        c.country_name,
        g.guide_name,
        g.per_day_charge
      FROM packages p
      LEFT JOIN countries c ON p.country_id = c.country_id
      LEFT JOIN tour_guides g ON p.guide_id = g.guide_id
    `);

    const packages = packageQuery.rows;

    // If no packages are found, return an empty response
    if (packages.length === 0) {
      return res
        .status(200)
        .json({ message: "No packages found", packages: [] });
    }

    // For each package, fetch its associated cities, locations, and hotels
    for (const pkg of packages) {
      const { package_id } = pkg;

      // Fetch cities associated with the package
      const citiesQuery = await pool.query(
        `
        SELECT 
          pc.package_city_id,
          pc.city_id,
          pc.days_stayed,
          pc.city_cost,
          ci.city_name
        FROM package_cities pc
        LEFT JOIN cities ci ON pc.city_id = ci.city_id
        WHERE pc.package_id = $1
      `,
        [package_id]
      );

      const cities = citiesQuery.rows;

      // Fetch locations and hotels for each city
      for (const city of cities) {
        const { package_city_id } = city;

        // Fetch locations for the city
        const locationsQuery = await pool.query(
          `
          SELECT 
            pl.location_id,
            l.location_name,
            pl.total_price AS location_price
          FROM package_locations pl
          LEFT JOIN locations l ON pl.location_id = l.location_id
          WHERE pl.package_city_id = $1
        `,
          [package_city_id]
        );

        city.locations = locationsQuery.rows;

        // Fetch hotels for the city
        const hotelsQuery = await pool.query(
          `
          SELECT 
            ph.hotel_id,
            h.hotel_name,
            ph.num_rooms,
            ph.hotel_cost,
            ph.days_stayed
          FROM package_hotels ph
          LEFT JOIN hotels h ON ph.hotel_id = h.hotel_id
          WHERE ph.package_city_id = $1
        `,
          [package_city_id]
        );

        city.hotels = hotelsQuery.rows;
      }

      // Attach cities to the package
      pkg.cities = cities;
    }

    // Return all packages with details
    res
      .status(200)
      .json({ message: "Packages retrieved successfully", packages });
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ message: "Error fetching packages", error });
  }
};

export { createPackage, getPackageById, deletePackageById, getAllPackages };
