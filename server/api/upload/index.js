// api/upload/index.js
const { supabaseAdmin } = require("../../server/config/supabase");

module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

module.exports = async function handler(req, res) {
  // Handle DELETE request
  if (
    req.method === "DELETE" ||
    (req.method === "POST" && req.body.action === "delete")
  ) {
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

  // Default response for unsupported methods
  return res.status(405).json({
    success: false,
    message: "Method not allowed",
    availableEndpoints: {
      uploadImage: "POST /api/upload/image",
      deleteImage: "DELETE /api/upload or POST /api/upload with action=delete",
    },
  });
};
