// File: server/routes/PrivacyPolicyRoutes.js

const express = require("express");
const router = express.Router();
const {
  getPrivacyPolicy,
  createOrUpdatePrivacyPolicy,
  deletePrivacyPolicy,
} = require("../controllers/PrivacyPolicy");

// Jika Anda punya middleware auth, uncomment baris di bawah
// const { protect, adminOnly } = require("../middleware/auth");

// @route   GET /api/privacy-policy
// @desc    Get privacy policy
// @access  Public
router.get("/", getPrivacyPolicy);

// @route   POST /api/privacy-policy
// @desc    Create or update privacy policy
// @access  Private/Admin
// Tambahkan middleware auth jika diperlukan: router.post("/", protect, adminOnly, createOrUpdatePrivacyPolicy);
router.post("/", createOrUpdatePrivacyPolicy);

// @route   DELETE /api/privacy-policy/:id
// @desc    Delete privacy policy
// @access  Private/Admin
// Tambahkan middleware auth jika diperlukan: router.delete("/:id", protect, adminOnly, deletePrivacyPolicy);
router.delete("/:id", deletePrivacyPolicy);

module.exports = router;
