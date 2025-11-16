const supabase = require("../../config/supabase");
const { validateProductUpdate } = require("../../validator/productValidator");

/**
 * PUT/PATCH update product by ID (full or partial update)
 */
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

/**
 * PATCH update multiple products (bulk update)
 */
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

/**
 * PATCH increment product sold count
 */
const incrementProductSold = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.body;

    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive number",
      });
    }

    // Get current product
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("sold")
      .eq("id", id)
      .single();

    if (fetchError || !product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment sold count
    const { data, error } = await supabase
      .from("products")
      .update({ sold: (product.sold || 0) + quantity })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error updating sold count",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: `Sold count incremented by ${quantity}`,
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

/**
 * PATCH update product price
 */
const updateProductPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

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
      return res.status(400).json({
        success: false,
        message: "Error updating price",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Price updated successfully",
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

module.exports = {
  updateProduct,
  updateMultipleProducts,
  incrementProductSold,
  updateProductPrice,
};
