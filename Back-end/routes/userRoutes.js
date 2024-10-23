// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/update/:userId", userController.update);
router.delete("/delete/:userId", userController.delete);

module.exports = router;
