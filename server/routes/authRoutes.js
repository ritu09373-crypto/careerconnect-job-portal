const express = require("express");


const {
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get current logged-in user
router.get("/me", protect, getCurrentUser);
router.patch("/me", protect, updateProfile);

module.exports = router;
