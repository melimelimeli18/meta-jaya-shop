// server/routes/uploadRoutes.js
const express = require("express");
const {
  uploadImage,
  deleteImage,
} = require("../controllers/upload/uploadImage");

const router = express.Router();

router.post("/upload-image", uploadImage);
router.delete("/delete-image", deleteImage);

router.post("/test-delete-image", async (req, res) => {
  try {
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({
        success: false,
        message: "imagePath is required",
      });
    }

    const { supabaseAdmin } = require("../config/supabase");

    console.log("Testing delete for path:", imagePath);

    const { data, error } = await supabaseAdmin.storage
      .from("product-images")
      .remove([imagePath]);

    if (error) {
      console.error("Delete error:", error);
      return res.status(400).json({
        success: false,
        message: "Failed to delete",
        error: error,
      });
    }

    res.json({
      success: true,
      message: "File deleted",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
