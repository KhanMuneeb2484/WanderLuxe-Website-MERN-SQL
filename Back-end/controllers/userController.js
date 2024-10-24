import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password_hash, phone_number, role } = req.body;
  console.log(req.body);
  try {
    // Check if user already exists
    const existingUserQuery = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUserQuery.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password_hash, salt);

    // Create user
    const newUserQuery = await pool.query(
      "INSERT INTO users (name, email, password_hash, phone_number, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, passwordHash, phone_number, role]
    );
    const newUser = newUserQuery.rows[0];
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password_hash } = req.body;

  // Validate request body
  if (!email || !password_hash) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if user exists
    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const user = userQuery.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password_hash, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT using secret from environment variable
    const token = jwt.sign(
      { userId: user.user_id, role: user.role }, // Include user role in the token for access control
      process.env.JWT_SECRET,
      {
        expiresIn: "30d", // You can adjust the expiry as needed
      }
    );

    // Return the token in the response
    res.status(200).json({ message: "Logged in Successfully !", token });
  } catch (error) {
    console.error("Error in loginUser:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};
const updateUser = async (req, res) => {
  const userId = req.user.user_id; // Get userId from the authenticated user
  const { name, email, phone_number, role } = req.body;

  try {
    console.log("Updating userId:", userId); // Log the userId being updated
    console.log("Update fields:", { name, email, phone_number, role }); // Log the fields to be updated

    const userQuery = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );

    if (!userQuery.rows || userQuery.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = [];
    const values = [];

    if (name) {
      updates.push(`name = $${updates.length + 1}`);
      values.push(name);
    }
    if (email) {
      updates.push(`email = $${updates.length + 1}`);
      values.push(email);
    }
    if (phone_number) {
      updates.push(`phone_number = $${updates.length + 1}`);
      values.push(phone_number);
    }
    if (role) {
      updates.push(`role = $${updates.length + 1}`);
      values.push(role);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(userId);
    const updateQuery = `UPDATE users SET ${updates.join(
      ", "
    )} WHERE user_id = $${values.length} RETURNING *`;

    console.log("Executing query:", updateQuery, "with values:", values); // Log the update query

    const updatedUserQuery = await pool.query(updateQuery, values);
    const updatedUser = updatedUserQuery.rows[0];

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find existing user
    const userQuery = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user
    await pool.query("DELETE FROM users WHERE user_id = $1", [userId]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export { registerUser, loginUser, updateUser, deleteUser };
