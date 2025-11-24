const supabase = require("../../config/supabase");
// const { supabase, initSupabase } = require("../config/supabase");
const { supabaseAdmin } = require("../../config/supabase");

// await initSupabase();

/**
 * Helper function to delete image from storage
 */
const deleteImageFromStorage = async (imageUrl) => {
  if (!imageUrl) {
    console.log("No image URL provided, skipping delete");
    return { success: false, message: "No image URL" };
  }

  try {
    console.log("====== DELETE IMAGE FROM STORAGE START ======");
    console.log("Full Image URL:", imageUrl);

    // Extract path from URL
    // Format bisa:
    // - https://xxx.supabase.co/storage/v1/object/public/product-images/products/uuid.ext
    // - https://xxx.supabase.co/storage/v1/object/public/product-images/products/uuid.ext?token=xxx

    let imagePath = null;

    // Method 1: Split by bucket name
    if (imageUrl.includes("/product-images/")) {
      const parts = imageUrl.split("/product-images/");
      imagePath = parts[1].split("?")[0]; // Remove query params if any
      console.log("Extracted path (method 1):", imagePath);
    }

    // Method 2: Fallback - extract everything after 'public/'
    if (!imagePath && imageUrl.includes("/public/")) {
      const parts = imageUrl.split("/public/product-images/");
      if (parts.length > 1) {
        imagePath = parts[1].split("?")[0];
        console.log("Extracted path (method 2):", imagePath);
      }
    }

    if (!imagePath) {
      console.error("Failed to extract image path from URL");
      return { success: false, message: "Invalid image URL format" };
    }

    console.log("Attempting to delete from bucket 'product-images'");
    console.log("Path:", imagePath);

    const { data, error } = await supabaseAdmin.storage
      .from("product-images")
      .remove([imagePath]);

    if (error) {
      console.error("❌ Supabase Storage DELETE ERROR:");
      console.error("Error message:", error.message);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return { success: false, error: error.message };
    }

    console.log("✅ Image deleted successfully from storage");
    console.log("Delete response:", data);
    console.log("====== DELETE IMAGE FROM STORAGE END ======");

    return { success: true, data };
  } catch (error) {
    console.error("❌ Exception in deleteImageFromStorage:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return { success: false, error: error.message };
  }
};

/**
 * DELETE product by ID
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("=== DELETE PRODUCT START ===");
    console.log("Deleting product with ID:", id);

    // Check if product exists first
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !existingProduct) {
      console.log("Product not found");
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete image from storage if exists
    if (existingProduct.image) {
      console.log("Product has image, deleting from storage...");
      await deleteImageFromStorage(existingProduct.image);
    }

    // Delete product from database
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      return res.status(400).json({
        success: false,
        message: "Error deleting product",
        error: error.message,
      });
    }

    console.log("Product deleted successfully");
    console.log("=== DELETE PRODUCT END ===");

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: existingProduct,
    });
  } catch (error) {
    console.error("=== DELETE PRODUCT ERROR ===");
    console.error("Error details:", error);

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

    console.log("=== DELETE MULTIPLE PRODUCTS START ===");
    console.log("Deleting products with IDs:", ids);

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

    // Delete images from storage
    console.log(`Deleting images for ${existingProducts.length} products...`);
    for (const product of existingProducts) {
      if (product.image) {
        await deleteImageFromStorage(product.image);
      }
    }

    // Delete products from database
    const { error } = await supabase.from("products").delete().in("id", ids);

    if (error) {
      console.error("Error deleting products:", error);
      return res.status(400).json({
        success: false,
        message: "Error deleting products",
        error: error.message,
      });
    }

    console.log(`${existingProducts.length} products deleted successfully`);
    console.log("=== DELETE MULTIPLE PRODUCTS END ===");

    res.status(200).json({
      success: true,
      message: `${existingProducts.length} products deleted successfully`,
      count: existingProducts.length,
      data: existingProducts,
    });
  } catch (error) {
    console.error("=== DELETE MULTIPLE PRODUCTS ERROR ===");
    console.error("Error details:", error);

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

    console.log("=== DELETE PRODUCTS BY CATEGORY START ===");
    console.log("Deleting products in category:", category);

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

    // Delete images from storage
    console.log(`Deleting images for ${productsToDelete.length} products...`);
    for (const product of productsToDelete) {
      if (product.image) {
        await deleteImageFromStorage(product.image);
      }
    }

    // Delete products from database
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("category", category);

    if (error) {
      console.error("Error deleting products by category:", error);
      return res.status(400).json({
        success: false,
        message: "Error deleting products by category",
        error: error.message,
      });
    }

    console.log(`${productsToDelete.length} products deleted from category`);
    console.log("=== DELETE PRODUCTS BY CATEGORY END ===");

    res.status(200).json({
      success: true,
      message: `${productsToDelete.length} products deleted from category '${category}'`,
      category: category,
      count: productsToDelete.length,
      data: productsToDelete,
    });
  } catch (error) {
    console.error("=== DELETE PRODUCTS BY CATEGORY ERROR ===");
    console.error("Error details:", error);

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

    console.log("=== DELETE PRODUCTS WITH FILTERS START ===");
    console.log("Filters:", { minPrice, maxPrice, minSold, maxSold });

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

    // Delete images from storage
    console.log(`Deleting images for ${productsToDelete.length} products...`);
    for (const product of productsToDelete) {
      if (product.image) {
        await deleteImageFromStorage(product.image);
      }
    }

    // Delete products from database
    const ids = productsToDelete.map((p) => p.id);
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .in("id", ids);

    if (deleteError) {
      console.error("Error deleting products:", deleteError);
      return res.status(400).json({
        success: false,
        message: "Error deleting products",
        error: deleteError.message,
      });
    }

    console.log(`${productsToDelete.length} products deleted with filters`);
    console.log("=== DELETE PRODUCTS WITH FILTERS END ===");

    res.status(200).json({
      success: true,
      message: `${productsToDelete.length} products deleted based on filters`,
      count: productsToDelete.length,
      filters: { minPrice, maxPrice, minSold, maxSold },
      data: productsToDelete,
    });
  } catch (error) {
    console.error("=== DELETE PRODUCTS WITH FILTERS ERROR ===");
    console.error("Error details:", error);

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
