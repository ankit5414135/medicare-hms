// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, logout, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')
], register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], login);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);
router.put('/change-password', protect, changePassword);

module.exports = router;