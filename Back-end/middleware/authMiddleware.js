// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import pool from "../config/db.js"; // Adjust the path to your db configuration

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the authorization header is present and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
      const userId = decoded.userId; // Extract userId from the decoded token

      const { rows } = await pool.query(
        "SELECT * FROM users WHERE user_id = $1", // Ensure the table name is correct
        [userId]
      ); // Get user by ID

      // Use a more defensive check for the existence of user
      if (rows.length <= 0) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = rows[0]; // Attach user information to the request object
      next(); // Call the next middleware or route handler
    } catch (error) {
      console.error("Error fetching user:", error); // Log the error for debugging
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message }); // Include error message in response
    }
  });
};

// Middleware to check user roles
const requireRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Access denied. Insufficient role." });
  }
  next(); // Call the next middleware or route handler if the user has the required role
};

export { authenticateJWT, requireRole };
