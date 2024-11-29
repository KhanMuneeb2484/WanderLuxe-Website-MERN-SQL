import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password_hash, phone_number, role } = req.body;

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
    const { password_hash: _, role: __, ...newUser } = newUserQuery.rows[0]; // Exclude password_hash and role
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const user = userQuery.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Return only necessary data
    const { password_hash: _, ...userData } = user; // Exclude password_hash and role
    res
      .status(200)
      .json({ message: "Logged in Successfully!", token, user: userData });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};

// Update user
const updateUser = async (req, res) => {
  const userId = req.user.user_id;
  const { name, email, phone_number, role } = req.body;

  try {
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

    const updatedUserQuery = await pool.query(updateQuery, values);
    const {
      password_hash: _,
      role: __,
      ...updatedUser
    } = updatedUserQuery.rows[0]; // Exclude password_hash and role
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const userQuery = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );

    if (!userQuery.rows || userQuery.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password_hash: _, role: __, ...user } = userQuery.rows[0]; // Exclude password_hash and role
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
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
    res.status(204).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    // Query to select all users and exclude password_hash and role from the response
    const usersQuery = await pool.query(
      "SELECT user_id, name, email, phone_number FROM users"
    );

    const users = usersQuery.rows;

    // Send the user list as the response
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get user (himself)
const getUser = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const userQuery = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );

    if (!userQuery.rows || userQuery.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password_hash: _, role: __, ...user } = userQuery.rows[0]; // Exclude password_hash and role
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserById,
  getUser,
  getAllUsers,
};
