// server/routes/ProductRoutes.js
const express = require("express");
const router = express.Router();
const {
  // GET
  getAllProducts,
  getProductById,
  getProductsWithFilters,
  getProductsByCategory,
  getCategories,
  // POST
  createProduct,
  createMultipleProducts,
  // PUT/PATCH
  updateProduct,
  updateMultipleProducts,
  // DELETE
  deleteProduct,
  deleteMultipleProducts,
  deleteProductsByCategory,
} = require("../controllers/ProductsController");

// ========== Base Route ==========
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
          "GET /products/filter?category=&minPrice=&maxPrice=&search=&limit=10&offset=0&sortBy=name&order=asc",
        byCategory: "GET /products/category/:category",
        categories: "GET /categories",
      },
      post: {
        createProduct: "POST /products",
        createMultiple: "POST /products/bulk",
      },
      put: {
        updateProduct: "PUT /products/:id",
        updateMultiple: "PATCH /products/bulk",
      },
      delete: {
        deleteProduct: "DELETE /products/:id",
        deleteMultiple: "DELETE /products/bulk",
        deleteByCategory: "DELETE /products/category/:category",
      },
    },
  });
});

// ========== GET Routes ==========
router.get("/categories", getCategories);
router.get("/products/filter", getProductsWithFilters);
router.get("/products/category/:category", getProductsByCategory);
router.get("/products/:id", getProductById);
router.get("/products", getAllProducts);

// ========== POST Routes ==========
router.post("/products/bulk", createMultipleProducts);
router.post("/products", createProduct);

// ========== PUT/PATCH Routes ==========
router.put("/products/:id", updateProduct);
router.patch("/products/:id", updateProduct);
router.patch("/products/bulk", updateMultipleProducts);

// ========== DELETE Routes ==========
router.delete("/products/category/:category", deleteProductsByCategory);
router.delete("/products/bulk", deleteMultipleProducts);
router.delete("/products/:id", deleteProduct);

module.exports = router;
