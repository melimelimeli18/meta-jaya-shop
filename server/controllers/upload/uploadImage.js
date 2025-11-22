// server/controllers/upload/uploadImage.js
const { supabaseAdmin } = require("../../config/supabase"); // Gunakan admin client untuk bypass RLS
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images only
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
}).single("image");

/**
 * Upload image to Supabase Storage
 */
const uploadImage = (req, res) => {
  // Use multer middleware
  upload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res.status(400).json({
          success: false,
          message: "File upload error",
          error: err.message,
          code: err.code,
          field: err.field,
        });
      } else if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (!req.file) {
        console.log("No file in request");
        console.log("Request headers:", req.headers);
        console.log("Request body:", req.body);
        console.log("Request files:", req.files);
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      try {
        console.log("=== UPLOAD IMAGE START ===");
        console.log("File info:", {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        });

        // Check if there's an old image to delete
        const oldImagePath = req.body.oldImagePath;
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

        // Generate unique filename
        const fileExt = path.extname(req.file.originalname);
        const fileName = `${uuidv4()}${fileExt}`;
        const filePath = `products/${fileName}`;

        console.log("Uploading to Supabase Storage:", filePath);

        // Upload to Supabase Storage using admin client (bypass RLS)
        const { data: uploadData, error: uploadError } =
          await supabaseAdmin.storage
            .from("product-images")
            .upload(filePath, req.file.buffer, {
              contentType: req.file.mimetype,
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
    } catch (outerError) {
      console.error("=== UPLOAD IMAGE OUTER ERROR ===");
      console.error("Error details:", outerError);

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: outerError.message,
      });
    }
  });
};

/**
 * Delete image from Supabase Storage
 */
const deleteImage = async (req, res) => {
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
