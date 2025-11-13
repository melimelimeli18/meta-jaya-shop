// server/controllers/ProductsController.js
const supabase = require("../config/supabase");
const {
  validateProduct,
  validateProductUpdate,
} = require("../validator/productValidator");

// ========== GET Operations ==========

// GET all products
const getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error fetching products from Supabase",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// GET product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// GET products with filters
const getProductsWithFilters = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      limit = 10,
      offset = 0,
      sortBy = "name",
      order = "asc",
    } = req.query;

    let query = supabase.from("products").select("*", { count: "exact" });

    if (category) {
      query = query.eq("category", category);
    }

    if (minPrice) {
      query = query.gte("price", Number(minPrice));
    }
    if (maxPrice) {
      query = query.lte("price", Number(maxPrice));
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order(sortBy, { ascending: order === "asc" })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error fetching products",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      total: count,
      data: data,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        hasMore: count > Number(offset) + Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// GET products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .order("name", { ascending: true });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error fetching products by category",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      category: category,
      count: data.length,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// GET all unique categories
const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("category");

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error fetching categories",
        error: error.message,
      });
    }

    const categories = [...new Set(data.map((item) => item.category))];

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ========== POST Operations ==========

// POST create single product
const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Validate input
    const validation = validateProduct(productData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validation.errors,
      });
    }

    // Check if product ID already exists
    const { data: existingProduct } = await supabase
      .from("products")
      .select("id")
      .eq("id", productData.id)
      .single();

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product with this ID already exists",
      });
    }

    // Insert product
    const { data, error } = await supabase
      .from("products")
      .insert([productData])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error creating product",
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// POST create multiple products (bulk insert)
const createMultipleProducts = async (req, res) => {
  try {
    const productsArray = req.body.products;

    if (!Array.isArray(productsArray) || productsArray.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Request body must contain a 'products' array with at least one product",
      });
    }

    // Validate all products
    const validationErrors = [];
    productsArray.forEach((product, index) => {
      const validation = validateProduct(product);
      if (!validation.isValid) {
        validationErrors.push({
          index: index,
          id: product.id,
          errors: validation.errors,
        });
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation errors found",
        errors: validationErrors,
      });
    }

    // Insert all products
    const { data, error } = await supabase
      .from("products")
      .insert(productsArray)
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error creating products",
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: `${data.length} products created successfully`,
      count: data.length,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ========== PUT/PATCH Operations ==========

// PUT/PATCH update product by ID (full or partial update)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate update data
    const validation = validateProductUpdate(updateData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validation.errors,
      });
    }

    // Check if product exists
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update product
    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error updating product",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// PATCH update multiple products (bulk update)
const updateMultipleProducts = async (req, res) => {
  try {
    const updates = req.body.updates;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Request body must contain an 'updates' array with at least one update",
      });
    }

    const results = {
      successful: [],
      failed: [],
    };

    // Process each update
    for (const update of updates) {
      const { id, ...updateData } = update;

      if (!id) {
        results.failed.push({
          id: null,
          error: "Product ID is required",
        });
        continue;
      }

      // Validate update data
      const validation = validateProductUpdate(updateData);
      if (!validation.isValid) {
        results.failed.push({
          id: id,
          error: "Validation error",
          details: validation.errors,
        });
        continue;
      }

      // Update product
      const { data, error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        results.failed.push({
          id: id,
          error: error.message,
        });
      } else {
        results.successful.push(data);
      }
    }

    const statusCode = results.failed.length === 0 ? 200 : 207; // 207 Multi-Status

    res.status(statusCode).json({
      success: results.failed.length === 0,
      message: `${results.successful.length} products updated, ${results.failed.length} failed`,
      successCount: results.successful.length,
      failedCount: results.failed.length,
      data: results.successful,
      errors: results.failed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ========== DELETE Operations ==========

// DELETE product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists first
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete product
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error deleting product",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: existingProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// DELETE multiple products
const deleteMultipleProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Request body must contain an 'ids' array with at least one product ID",
      });
    }

    // Get existing products before deletion
    const { data: existingProducts } = await supabase
      .from("products")
      .select("*")
      .in("id", ids);

    // Delete products
    const { error } = await supabase.from("products").delete().in("id", ids);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error deleting products",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: `${existingProducts.length} products deleted successfully`,
      count: existingProducts.length,
      data: existingProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// DELETE products by category
const deleteProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Get products in category before deletion
    const { data: productsToDelete } = await supabase
      .from("products")
      .select("*")
      .eq("category", category);

    if (!productsToDelete || productsToDelete.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found in this category",
      });
    }

    // Delete products
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("category", category);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error deleting products by category",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: `${productsToDelete.length} products deleted from category '${category}'`,
      category: category,
      count: productsToDelete.length,
      data: productsToDelete,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
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
};
