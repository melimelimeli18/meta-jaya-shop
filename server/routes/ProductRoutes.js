const express = require("express");
const router = express.Router();

const getProductsController = require("../controllers/products/getProducts");
const createProductsController = require("../controllers/products/createProducts");
const updateProductsController = require("../controllers/products/updateProducts");
const deleteProductsController = require("../controllers/products/deleteProducts");

const {
  getAllProducts,
  getProductById,
  getProductsWithFilters,
  getProductsByCategory,
  getCategories,
  getTopSellingProducts,
  getProductStats,
} = getProductsController;

const { createProduct, createMultipleProducts } = createProductsController;

const {
  updateProduct,
  updateMultipleProducts,
  incrementProductSold,
  updateProductPrice,
} = updateProductsController;

const {
  deleteProduct,
  deleteMultipleProducts,
  deleteProductsByCategory,
  deleteProductsWithFilters,
} = deleteProductsController;

// Base Route
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Products API is running",
    timestamp: new Date().toISOString(),
    endpoints: {
      get: {
        allProducts: "GET /products",
        productById: "GET /products/:id",
        filterProducts:
          "GET /products/filter?category=&minPrice=&maxPrice=&minSold=&search=&limit=10&offset=0&sortBy=name&order=asc",
        byCategory: "GET /products/category/:category",
        categories: "GET /categories",
        topSelling: "GET /products/top-selling?limit=10&category=",
        statistics: "GET /products/stats",
      },
      post: {
        createProduct: "POST /products",
        createMultiple: "POST /products/bulk",
      },
      put: {
        updateProduct: "PUT /products/:id",
        updateMultiple: "PATCH /products/bulk",
        incrementSold: "PATCH /products/:id/sold",
        updatePrice: "PATCH /products/:id/price",
      },
      delete: {
        deleteProduct: "DELETE /products/:id",
        deleteMultiple: "DELETE /products/bulk",
        deleteByCategory: "DELETE /products/category/:category",
        deleteWithFilters: "DELETE /products/filter",
      },
    },
  });
});

// ========== GET Routes ==========
router.get("/categories", getCategories);
router.get("/products/stats", getProductStats);
router.get("/products/top-selling", getTopSellingProducts);
router.get("/products/filter", getProductsWithFilters);
router.get("/products/category/:category", getProductsByCategory);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);

// POST Routes
router.post("/products/bulk", createMultipleProducts);
router.post("/products", createProduct);

// PUT/PATCH Routes
router.patch("/products/bulk", updateMultipleProducts);
router.patch("/products/:id/price", updateProductPrice);
router.put("/products/:id", updateProduct);
router.patch("/products/:id", updateProduct);

// DELETE Routes
router.delete("/products/filter", deleteProductsWithFilters);
router.delete("/products/bulk", deleteMultipleProducts);
router.delete("/products/category/:category", deleteProductsByCategory);
router.delete("/products/:id", deleteProduct);

module.exports = router;
