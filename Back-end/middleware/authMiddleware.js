// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js"; // Adjust the path to your db configuration

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
      const userId = decoded.userId; // Assuming your JWT includes userId
      const { rows } = await pool.query(
        "SELECT * FROM User WHERE user_id = $1",
        [userId]
      ); // Get user by ID

      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = rows[0]; // Attach user information to the request object
      next(); // Call the next middleware or route handler
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

const requireRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Access denied. Insufficient role." });
  }
  next(); // Call the next middleware or route handler if the user has the required role
};

export { authenticateJWT, requireRole };
