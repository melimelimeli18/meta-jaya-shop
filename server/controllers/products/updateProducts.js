// server/controllers/products/updateProducts.js
const supabase = require("../../config/supabase");
const { supabaseAdmin } = require("../../config/supabase");
const { validateProductUpdate } = require("../../validator/productValidator");

/**
 * Helper function to delete image from storage
 */
const deleteImageFromStorage = async (imageUrl) => {
  if (!imageUrl) {
    console.log("No image URL provided, skipping delete");
    return { success: false, message: "No image URL" };
  }

  try {
    console.log("====== DELETE OLD IMAGE START ======");
    console.log("Full Image URL:", imageUrl);

    let imagePath = null;

    // Extract path from URL
    if (imageUrl.includes("/product-images/")) {
      const parts = imageUrl.split("/product-images/");
      imagePath = parts[1].split("?")[0]; // Remove query params if any
      console.log("Extracted path:", imagePath);
    }

    if (!imagePath) {
      console.error("Failed to extract image path from URL");
      return { success: false, message: "Invalid image URL format" };
    }

    console.log("Deleting from bucket 'product-images', path:", imagePath);

    const { data, error } = await supabaseAdmin.storage
      .from("product-images")
      .remove([imagePath]);

    if (error) {
      console.error("❌ Error deleting old image:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ Old image deleted successfully");
    console.log("====== DELETE OLD IMAGE END ======");

    return { success: true, data };
  } catch (error) {
    console.error("❌ Exception in deleteImageFromStorage:", error);
    return { success: false, error: error.message };
  }
};

/**
 * PUT/PATCH update product by ID (full or partial update)
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("=== UPDATE PRODUCT START ===");
    console.log("Product ID:", id);
    console.log("Update data:", JSON.stringify(updateData, null, 2));

    // Check if at least one field is provided for partial updates
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    // Check if product exists and get current data
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingProduct) {
      console.log("Product not found");
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    console.log("Existing product:", existingProduct);

    // Check if image is being updated
    if (updateData.image && updateData.image !== existingProduct.image) {
      console.log("🔄 Image is being updated!");
      console.log("Old image:", existingProduct.image);
      console.log("New image:", updateData.image);

      // Delete old image from storage
      if (existingProduct.image) {
        console.log("Deleting old image from storage...");
        const deleteResult = await deleteImageFromStorage(
          existingProduct.image
        );
        if (deleteResult.success) {
          console.log("✅ Old image deleted successfully");
        } else {
          console.warn(
            "⚠️  Failed to delete old image, but continuing with update"
          );
        }
      }
    }

    // Validate update data
    const validation = validateProductUpdate(updateData);
    console.log("Validation result:", validation);

    if (!validation.isValid) {
      console.log("Validation failed:", validation.errors);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validation.errors,
      });
    }

    // Update product
    console.log("Updating product in database...");
    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return res.status(400).json({
        success: false,
        message: "Error updating product",
        error: error.message,
      });
    }

    console.log("Product updated successfully:", data);
    console.log("=== UPDATE PRODUCT END ===");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: data,
    });
  } catch (error) {
    console.error("=== UPDATE PRODUCT ERROR ===");
    console.error("Error details:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * PATCH update multiple products (bulk update)
 */
const updateMultipleProducts = async (req, res) => {
  try {
    const { updates } = req.body;

    console.log("=== UPDATE MULTIPLE PRODUCTS START ===");
    console.log("Updates:", JSON.stringify(updates, null, 2));

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Request body must contain an 'updates' array with at least one product update",
      });
    }

    const results = {
      successful: [],
      failed: [],
    };

    for (const update of updates) {
      if (!update.id) {
        results.failed.push({
          update: update,
          error: "Product ID is required for each update",
        });
        continue;
      }

      const { id, ...updateData } = update;

      // Get existing product
      const { data: existingProduct, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !existingProduct) {
        results.failed.push({
          id: id,
          error: "Product not found",
        });
        continue;
      }

      // Check if image is being updated
      if (updateData.image && updateData.image !== existingProduct.image) {
        console.log(`🔄 Deleting old image for product ${id}`);
        if (existingProduct.image) {
          const deleteResult = await deleteImageFromStorage(
            existingProduct.image
          );
          if (deleteResult.success) {
            console.log(`✅ Old image deleted for product ${id}`);
          } else {
            console.warn(`⚠️  Failed to delete old image for product ${id}`);
          }
        }
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

    console.log(`Updated ${results.successful.length} products`);
    if (results.failed.length > 0) {
      console.log(
        `Failed to update ${results.failed.length} products:`,
        results.failed
      );
    }
    console.log("=== UPDATE MULTIPLE PRODUCTS END ===");

    const statusCode = results.failed.length === 0 ? 200 : 207; // 207 Multi-Status

    res.status(statusCode).json({
      success: results.failed.length === 0,
      message: `${results.successful.length} products updated, ${results.failed.length} failed`,
      successCount: results.successful.length,
      failedCount: results.failed.length,
      data: results.successful,
      errors: results.failed.length > 0 ? results.failed : undefined,
    });
  } catch (error) {
    console.error("=== UPDATE MULTIPLE PRODUCTS ERROR ===");
    console.error("Error details:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * PATCH update product price
 */
const updateProductPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    console.log("=== UPDATE PRODUCT PRICE START ===");
    console.log("Product ID:", id);
    console.log("New price:", price);

    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a non-negative number",
      });
    }

    // Check if product exists
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError || !existingProduct) {
      console.log("Product not found");
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update price
    const { data, error } = await supabase
      .from("products")
      .update({ price })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return res.status(400).json({
        success: false,
        message: "Error updating price",
        error: error.message,
      });
    }

    console.log("Price updated successfully:", data);
    console.log("=== UPDATE PRODUCT PRICE END ===");

    res.status(200).json({
      success: true,
      message: "Price updated successfully",
      data: data,
    });
  } catch (error) {
    console.error("=== UPDATE PRODUCT PRICE ERROR ===");
    console.error("Error details:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  updateProduct,
  updateMultipleProducts,
  updateProductPrice,
};
