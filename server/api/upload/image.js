// api/upload/image.js
const { supabaseAdmin } = require("../../server/config/supabase");

// PENTING: Disable default body parser Vercel
module.exports.config = {
  api: {
    bodyParser: true, // Enable Vercel's body parser
  },
};

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request (preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    console.log("=== DEBUG INFO ===");
    console.log("Method:", req.method);
    console.log("Headers:", req.headers);
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

    // Validasi body
    if (!body || typeof body !== "object") {
      return res.status(400).json({
        success: false,
        message: "Request body is empty or invalid",
        debug: {
          bodyType: typeof req.body,
          bodyValue: req.body,
          contentType: req.headers["content-type"],
        },
      });
    }

    const { image, oldImagePath } = body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image data provided",
        debug: {
          receivedKeys: Object.keys(body),
        },
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

    // Generate unique filename using timestamp
    const fileName = `product-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    console.log("Uploading to Supabase Storage:", filePath);
    console.log("File size:", buffer.length, "bytes");

    // Upload to Supabase Storage
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

    return res.status(200).json({
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
    console.error("Stack:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
