// api/upload/delete.js
// Vercel Serverless Function untuk delete image

const { supabaseAdmin } = require("../../server/config/supabase");

// Config untuk Vercel serverless function
export const config = {
  api: {
    bodyParser: true,
  },
};

/**
 * Delete image handler untuk Vercel
 */
export default async function handler(req, res) {
  // Only allow POST/DELETE method
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { filePath } = req.body;

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

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: data,
    });
  } catch (error) {
    console.error("=== DELETE IMAGE ERROR ===");
    console.error("Error details:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
