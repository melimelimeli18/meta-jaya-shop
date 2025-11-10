// server/validators/productValidator.js

/**
 * Validate product data for creation
 */
const validateProduct = (product) => {
  const errors = [];

  // Required fields
  if (
    !product.id ||
    typeof product.id !== "string" ||
    product.id.trim() === ""
  ) {
    errors.push("Product ID is required and must be a non-empty string");
  }

  if (
    !product.name ||
    typeof product.name !== "string" ||
    product.name.trim() === ""
  ) {
    errors.push("Product name is required and must be a non-empty string");
  }

  if (product.price === undefined || product.price === null) {
    errors.push("Product price is required");
  } else if (typeof product.price !== "number" || product.price < 0) {
    errors.push("Product price must be a non-negative number");
  }

  if (
    !product.category ||
    typeof product.category !== "string" ||
    product.category.trim() === ""
  ) {
    errors.push("Product category is required and must be a non-empty string");
  }

  // Optional fields validation
  if (
    product.description !== undefined &&
    typeof product.description !== "string"
  ) {
    errors.push("Product description must be a string");
  }

  if (product.stock !== undefined) {
    if (
      typeof product.stock !== "number" ||
      product.stock < 0 ||
      !Number.isInteger(product.stock)
    ) {
      errors.push("Product stock must be a non-negative integer");
    }
  }

  if (
    product.image_url !== undefined &&
    typeof product.image_url !== "string"
  ) {
    errors.push("Product image_url must be a string");
  }

  if (
    product.is_active !== undefined &&
    typeof product.is_active !== "boolean"
  ) {
    errors.push("Product is_active must be a boolean");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

/**
 * Validate product data for update (partial update allowed)
 */
const validateProductUpdate = (updateData) => {
  const errors = [];

  // Check if at least one field is being updated
  if (Object.keys(updateData).length === 0) {
    errors.push("At least one field must be provided for update");
    return {
      isValid: false,
      errors: errors,
    };
  }

  // Validate only the fields that are present
  if (updateData.id !== undefined) {
    errors.push("Product ID cannot be updated");
  }

  if (updateData.name !== undefined) {
    if (typeof updateData.name !== "string" || updateData.name.trim() === "") {
      errors.push("Product name must be a non-empty string");
    }
  }

  if (updateData.price !== undefined) {
    if (typeof updateData.price !== "number" || updateData.price < 0) {
      errors.push("Product price must be a non-negative number");
    }
  }

  if (updateData.category !== undefined) {
    if (
      typeof updateData.category !== "string" ||
      updateData.category.trim() === ""
    ) {
      errors.push("Product category must be a non-empty string");
    }
  }

  if (
    updateData.description !== undefined &&
    typeof updateData.description !== "string"
  ) {
    errors.push("Product description must be a string");
  }

  if (updateData.stock !== undefined) {
    if (
      typeof updateData.stock !== "number" ||
      updateData.stock < 0 ||
      !Number.isInteger(updateData.stock)
    ) {
      errors.push("Product stock must be a non-negative integer");
    }
  }

  if (
    updateData.image_url !== undefined &&
    typeof updateData.image_url !== "string"
  ) {
    errors.push("Product image_url must be a string");
  }

  if (
    updateData.is_active !== undefined &&
    typeof updateData.is_active !== "boolean"
  ) {
    errors.push("Product is_active must be a boolean");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

module.exports = {
  validateProduct,
  validateProductUpdate,
};
