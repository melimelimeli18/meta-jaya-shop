// server/routes/FeaturedProductRoutes.js
const express = require("express");
const router = express.Router();
const FeaturedProductController = require("../controllers/FeaturedProductController");

// Batch update featured products
router.patch(
  "/products/featured/batch",
  FeaturedProductController.batchUpdateFeatured
);

// Toggle featured status for a single product (for backward compatibility)
router.patch(
  "/products/:id/featured",
  FeaturedProductController.toggleFeaturedStatus
);

module.exports = router;
