const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getProductsWithFilters,
  getProductsByCategory,
  getCategories,
} = require("../controllers/ProductsController");

// Base route for health check
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Products API is running",
    timestamp: new Date().toISOString(),
    endpoints: {
      getAllProducts: "/products",
      getProductById: "/products/:id",
      filterProducts:
        "/products/filter?category=&minPrice=&maxPrice=&search=&limit=10&offset=0",
      getByCategory: "/products/category/:category",
      getCategories: "/categories",
    },
  });
});

// GET all unique categories
router.get("/categories", getCategories);

// GET products with filters (must be before /:id to avoid conflict)
// Example: /products/filter?category=Electronics&minPrice=100&maxPrice=1000&search=phone&limit=5&sortBy=price&order=asc
router.get("/products/filter", getProductsWithFilters);

// GET products by category
// Example: /products/category/Electronics
router.get("/products/category/:category", getProductsByCategory);

// GET all products
router.get("/products", getAllProducts);

// GET single product by ID
// Example: /products/PROD001
router.get("/products/:id", getProductById);

module.exports = router;
