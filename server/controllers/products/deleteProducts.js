const supabase = require("../../config/supabase");

/**
 * DELETE product by ID
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists first
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

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

/**
 * DELETE multiple products
 */
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

    if (!existingProducts || existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found with provided IDs",
      });
    }

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

/**
 * DELETE products by category
 */
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

/**
 * DELETE products with filters (dangerous - requires confirmation)
 */
const deleteProductsWithFilters = async (req, res) => {
  try {
    const { minPrice, maxPrice, minSold, maxSold, confirm } = req.body;

    // Require explicit confirmation
    if (confirm !== true) {
      return res.status(400).json({
        success: false,
        message:
          "This operation requires confirmation. Please include 'confirm: true' in request body",
      });
    }

    let query = supabase.from("products").select("*");

    // Apply filters
    if (minPrice !== undefined) {
      query = query.gte("price", Number(minPrice));
    }
    if (maxPrice !== undefined) {
      query = query.lte("price", Number(maxPrice));
    }
    if (minSold !== undefined) {
      query = query.gte("sold", Number(minSold));
    }
    if (maxSold !== undefined) {
      query = query.lte("sold", Number(maxSold));
    }

    // Get products to delete
    const { data: productsToDelete, error: fetchError } = await query;

    if (fetchError) {
      return res.status(400).json({
        success: false,
        message: "Error fetching products to delete",
        error: fetchError.message,
      });
    }

    if (!productsToDelete || productsToDelete.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found matching the filters",
      });
    }

    // Delete products
    const ids = productsToDelete.map((p) => p.id);
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .in("id", ids);

    if (deleteError) {
      return res.status(400).json({
        success: false,
        message: "Error deleting products",
        error: deleteError.message,
      });
    }

    res.status(200).json({
      success: true,
      message: `${productsToDelete.length} products deleted based on filters`,
      count: productsToDelete.length,
      filters: { minPrice, maxPrice, minSold, maxSold },
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
  deleteProduct,
  deleteMultipleProducts,
  deleteProductsByCategory,
  deleteProductsWithFilters,
};
