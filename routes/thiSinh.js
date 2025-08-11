const express = require('express');
const router = express.Router();
const ThiSinhController = require('../controllers/ThiSinhController');
const authMiddleware = require('../middleware/auth');
const { validateThiSinh, validateLogin } = require('../middleware/validation');
const rateLimit = require('express-rate-limit');

// Rate limiting cho login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  }
});

// Public routes
router.post('/register', validateThiSinh, ThiSinhController.register);
router.post('/login', loginLimiter, validateLogin, ThiSinhController.login);

module.exports = router;
