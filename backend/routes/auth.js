const express = require('express');
const { body, validationResult } = require('express-validator');
const { loginUser } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts, try again later.' },
});

// Regex for validation
const accountNumberRegex = /^\d{10}$/;

// LOGIN
router.post(
  '/login',
  authLimiter,
  [
    body('username').exists().trim(),
    body('accountNumber').matches(accountNumberRegex),
    body('password').exists(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ message: 'Validation error', errors: errors.array() });
    return loginUser(req, res, next);
  }
);

// LOGOUT
// LOGOUT
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET current logged-in user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      username: user.username,
      role: user.role,
      accountNumber: user.accountNumber,
    });
  } catch (err) {
    console.error('Auth /me error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route to verify API + HTTPS connection
router.get("/test", (req, res) => {
  res.json({ message: "Auth API is reachable ✅" });
});

module.exports = router;
