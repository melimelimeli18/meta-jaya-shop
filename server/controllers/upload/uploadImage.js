// server/controllers/upload/uploadImage.js
const supabase = require("../../config/supabase");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Configure multer memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).single("image");

/**
 * Upload image to Supabase Storage
 */
const uploadImage = (req, res) => {
  upload(req, res, async (err) => {
    // ERROR HANDLING MULTER
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: "File upload error",
        error: err.message,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // REAL TRY-CATCH STARTS HERE
    try {
      console.log("=== UPLOAD IMAGE START ===");

      const fileExt = path.extname(req.file.originalname);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        return res.status(400).json({
          success: false,
          message: "Error uploading to storage",
          error: uploadError.message,
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          fileName,
          filePath,
          publicUrl: publicUrlData.publicUrl,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  });
};

/**
 * Delete image
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

    const { data, error } = await supabase.storage
      .from("product-images")
      .remove([filePath]);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error deleting image",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { uploadImage, deleteImage };
