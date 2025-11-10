const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dataRoutes = require("./routes/ProductsRoutes");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Ganti dengan URL frontend Anda di production
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Products API - Express + Supabase",
    version: "1.0.0",
    endpoints: {
      health: "/",
      apiBase: "/api",
      getAllProducts: "/api/products",
      getProductById: "/api/products/:id",
      filterProducts:
        "/api/products/filter?category=&minPrice=&maxPrice=&search=",
      getByCategory: "/api/products/category/:category",
      getCategories: "/api/categories",
    },
    examples: {
      allProducts: "/api/products",
      singleProduct: "/api/products/PROD001",
      filter:
        "/api/products/filter?category=Electronics&minPrice=100&maxPrice=1000",
      byCategory: "/api/products/category/Electronics",
      categories: "/api/categories",
    },
  });
});

// API Routes
app.use("/api", dataRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});
