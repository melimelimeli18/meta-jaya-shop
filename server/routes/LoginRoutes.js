// server\routes\LoginRoutes.js
// File: server/routes/LoginRoutes.js

const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  verifyToken,
  logoutAdmin,
} = require("../controllers/loginController");

// @route   POST /api/admin/login
// @desc    Login admin
// @access  Public
router.post("/login", loginAdmin);

// @route   POST /api/admin/verify
// @desc    Verify JWT token
// @access  Private
router.post("/verify", verifyToken);

// @route   POST /api/admin/logout
// @desc    Logout admin
// @access  Private
router.post("/logout", logoutAdmin);

module.exports = router;
