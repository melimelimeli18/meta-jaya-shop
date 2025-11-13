// routes/HeroRoutes.js
const express = require('express');
const router = express.Router();
const HeroController = require('../controllers/HeroController');
const { validateHeroUpdate } = require('../validator/heroValidator');
const multer = require('multer');

// Setup multer untuk handle file upload
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// GET - Ambil data hero section
router.get('/', HeroController.getHero);

// PUT - Update hero section
router.put('/', validateHeroUpdate, HeroController.updateHero);

// POST - Upload banner image (opsional)
router.post('/upload-banner', upload.single('banner'), HeroController.uploadBanner);

module.exports = router;