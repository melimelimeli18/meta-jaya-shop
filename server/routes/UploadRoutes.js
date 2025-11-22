// server/routes/uploadRoutes.js
const express = require("express");
const {
  uploadImage,
  deleteImage,
} = require("../controllers/upload/uploadImage");

const router = express.Router();

router.post("/upload-image", uploadImage);
router.delete("/delete-image", deleteImage);

module.exports = router;
