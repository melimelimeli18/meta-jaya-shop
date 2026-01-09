// server/controllers/upload/uploadImage.js
const { supabaseAdmin } = require("../../config/supabase");

/**
 * Upload image to Supabase Storage (Base64 approach)
 */
const uploadImage = async (req, res) => {
  try {
    console.log("=== DEBUG INFO ===");
    console.log("Method:", req.method);
    console.log("Body type:", typeof req.body);
    console.log("Body keys:", req.body ? Object.keys(req.body) : "no body");

    // Parse body jika masih string (untuk compatibility Vercel)
    let body = req.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    }

    // Validasi body
    if (!body || typeof body !== "object") {
      return res.status(400).json({
        success: false,
        message: "Request body is empty or invalid",
        debug: {
          bodyType: typeof req.body,
          contentType: req.headers["content-type"],
        },
      });
    }

    const { image, oldImagePath } = body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image data provided",
        receivedKeys: Object.keys(body),
      });
    }

    console.log("=== UPLOAD IMAGE START ===");

    // Check if there's an old image to delete
    if (oldImagePath) {
      console.log("Deleting old image:", oldImagePath);
      const { error: deleteError } = await supabaseAdmin.storage
        .from("product-images")
        .remove([oldImagePath]);

      if (deleteError) {
        console.error("Error deleting old image:", deleteError);
        // Continue with upload even if delete fails
      } else {
        console.log("Old image deleted successfully");
      }
    }

    // Validate base64 format
    if (!image.startsWith("data:image/")) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid image format. Must be base64 data URL (data:image/...)",
      });
    }

    // Parse base64 image
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Get file extension from base64 header
    const mimeMatch = image.match(/data:image\/(\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "png";
    const fileExt = mimeType === "jpeg" ? "jpg" : mimeType;

    // Generate unique filename using timestamp (seperti HeroController)
    const fileName = `product-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    console.log("Uploading to Supabase Storage:", filePath);
    console.log("File size:", buffer.length, "bytes");

    // Upload to Supabase Storage using admin client (bypass RLS)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("product-images")
      .upload(filePath, buffer, {
        contentType: `image/${mimeType}`,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return res.status(400).json({
        success: false,
        message: "Error uploading to storage",
        error: uploadError.message,
      });
    }

    console.log("Upload successful:", uploadData);

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(filePath);

    console.log("Public URL:", publicUrlData.publicUrl);
    console.log("=== UPLOAD IMAGE END ===");

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        fileName: fileName,
        filePath: filePath,
        publicUrl: publicUrlData.publicUrl,
      },
    });
  } catch (error) {
    console.error("=== UPLOAD IMAGE ERROR ===");
    console.error("Error details:", error);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Delete image from Supabase Storage
 */
const deleteImage = async (req, res) => {
  try {
    console.log("=== DELETE DEBUG ===");
    console.log("Body type:", typeof req.body);
    console.log("Body:", req.body);

    // Parse body jika masih string
    let body = req.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    }

    if (!body || typeof body !== "object") {
      return res.status(400).json({
        success: false,
        message: "Request body is empty",
      });
    }

    const { filePath } = body;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "File path is required",
      });
    }

    console.log("=== DELETE IMAGE START ===");
    console.log("Deleting file:", filePath);

    const { data, error } = await supabaseAdmin.storage
      .from("product-images")
      .remove([filePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      return res.status(400).json({
        success: false,
        message: "Error deleting image",
        error: error.message,
      });
    }

    console.log("Delete successful:", data);
    console.log("=== DELETE IMAGE END ===");

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: data,
    });
  } catch (error) {
    console.error("=== DELETE IMAGE ERROR ===");
    console.error("Error details:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
