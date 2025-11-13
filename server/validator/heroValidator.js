// validator/heroValidator.js
const { body, validationResult } = require('express-validator');

const validateHeroUpdate = [
  body('headline')
    .notEmpty()
    .withMessage('Headline tidak boleh kosong')
    .isLength({ max: 255 })
    .withMessage('Headline maksimal 255 karakter'),
  
  body('sub_headline')
    .notEmpty()
    .withMessage('Sub headline tidak boleh kosong')
    .isLength({ max: 500 })
    .withMessage('Sub headline maksimal 500 karakter'),
  
  body('banner_image_url')
    .optional()
    .isURL()
    .withMessage('Banner image URL tidak valid'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];

module.exports = {
  validateHeroUpdate
};