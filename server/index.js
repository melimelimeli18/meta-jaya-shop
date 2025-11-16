const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// const dataRoutes = require("./routes/ProductRoutes");
const heroRoutes = require("./routes/HeroRoutes");
const { getHero } = require("./controllers/HeroController");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes AFTER app initialization
const productRoutes = require("./routes/ProductRoutes");

// Root endpoint with complete API documentation
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Products API - Express + Supabase",
    version: "1.0.0",
    status: "Running",
    timestamp: new Date().toISOString(),

    endpoints: {
      // GET Endpoints
      getAllProducts: {
        method: "GET",
        path: "/api/products",
        query: "?sortBy=name&order=asc",
        description: "Get all products with optional sorting",
      },
      getProductById: {
        method: "GET",
        path: "/api/products/:id",
        example: "/api/products/0001",
        description: "Get single product by ID",
      },
      filterProducts: {
        method: "GET",
        path: "/api/products/filter",
        query:
          "?category=&minPrice=&maxPrice=&minSold=&search=&limit=10&offset=0&sortBy=name&order=asc",
        description: "Get products with advanced filters and pagination",
      },
      getByCategory: {
        method: "GET",
        path: "/api/products/category/:category",
        example: "/api/products/category/Microphone",
        description: "Get all products in a category",
      },
      getCategories: {
        method: "GET",
        path: "/api/categories",
        description: "Get all unique categories with product count",
      },
      getTopSelling: {
        method: "GET",
        path: "/api/products/top-selling",
        query: "?limit=10&category=",
        description: "Get top selling products",
      },
      getStats: {
        method: "GET",
        path: "/api/products/stats",
        description: "Get overall product statistics",
      },

      // POST Endpoints
      createProduct: {
        method: "POST",
        path: "/api/products",
        body: {
          name: "string (required)",
          price: "number (required)",
          category: "string (required)",
          link: "string/url (required)",
          description: "string (optional)",
          image: "string/url (optional)",
          sold: "integer (optional, default: 0)",
        },
        description: "Create a new product (ID auto-generated)",
      },
      createMultiple: {
        method: "POST",
        path: "/api/products/bulk",
        body: {
          products: "array of product objects",
        },
        description: "Create multiple products at once",
      },

      // PUT/PATCH Endpoints
      updateProduct: {
        method: "PUT/PATCH",
        path: "/api/products/:id",
        body: "Any product field(s) to update",
        description: "Update product (partial update allowed)",
      },
      updateMultiple: {
        method: "PATCH",
        path: "/api/products/bulk",
        body: {
          updates: "array of {id, ...fields}",
        },
        description: "Update multiple products at once",
      },
      incrementSold: {
        method: "PATCH",
        path: "/api/products/:id/sold",
        body: {
          quantity: "number (default: 1)",
        },
        description: "Increment product sold count",
      },
      updatePrice: {
        method: "PATCH",
        path: "/api/products/:id/price",
        body: {
          price: "number",
        },
        description: "Update product price",
      },

      // DELETE Endpoints
      deleteProduct: {
        method: "DELETE",
        path: "/api/products/:id",
        description: "Delete single product by ID",
      },
      deleteMultiple: {
        method: "DELETE",
        path: "/api/products/bulk",
        body: {
          ids: "array of product IDs",
        },
        description: "Delete multiple products at once",
      },
      deleteByCategory: {
        method: "DELETE",
        path: "/api/products/category/:category",
        description: "Delete all products in a category (⚠️ use with caution)",
      },
      deleteWithFilters: {
        method: "DELETE",
        path: "/api/products/filter",
        body: {
          minPrice: "number (optional)",
          maxPrice: "number (optional)",
          minSold: "number (optional)",
          maxSold: "number (optional)",
          confirm: "true (required for safety)",
        },
        description:
          "Delete products matching filters (⚠️ requires confirmation)",
      },
      getHero: "/api/hero",
      updateHero: "PUT /api/hero",
      uploadBanner: "POST /api/hero/upload-banner",
    },

    examples: {
      // GET Examples
      allProducts: "/api/products",
      sortedProducts: "/api/products?sortBy=price&order=desc",
      singleProduct: "/api/products/0001",
      filterByPrice:
        "/api/products/filter?minPrice=100000&maxPrice=500000&sortBy=sold&order=desc",
      filterByCategory: "/api/products/filter?category=Microphone&limit=20",
      searchProducts: "/api/products/filter?search=wireless",
      byCategory: "/api/products/category/Microphone",
      categories: "/api/categories",
      hero: "/api/hero",
      topSelling: "/api/products/top-selling?limit=5",
      topSellingByCategory:
        "/api/products/top-selling?limit=5&category=Microphone",
      statistics: "/api/products/stats",
    },
  });
});

// API Routes
// app.use("/api", dataRoutes);
app.use("/api", productRoutes);
app.use("/api/hero", heroRoutes);

// 404 Handler
// Mount API routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    requestedPath: req.originalUrl,
    method: req.method,
    availableRoutes: "Visit / or /api for available endpoints",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════╗
  ║                                                ║
  ║   🚀 Products API Server is Running!          ║
  ║                                                ║
  ║   📍 Port: ${PORT}                                  ║
  ║   🌐 Base URL: http://localhost:${PORT}           ║
  ║   📚 API Docs: http://localhost:${PORT}/api       ║
  ║   ⏰ Started: ${new Date().toLocaleString()}   ║
  ║                                                ║
  ╚════════════════════════════════════════════════╝
  `);

  console.log("✅ Ready to accept requests!\n");
  console.log("Quick Test:");
  console.log(`   GET  http://localhost:${PORT}/api/products`);
  console.log(`   GET  http://localhost:${PORT}/api/categories\n`);
});

module.exports = app;
