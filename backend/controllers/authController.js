const User = require('../models/User');
const bcrypt = require('bcryptjs'); // ensure using bcryptjs
const jwt = require('jsonwebtoken');

// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { username, accountNumber, password } = req.body;

    if (!username || !accountNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find user by BOTH username + account number
    const user = await User.findOne({
      username,
      accountNumber: String(accountNumber)
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or account number' });
    }

    // Compare password with correct field: user.password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: `${process.env.JWT_EXPIRES_HOURS || 4}h` }
    );

    // Optional: Set cookie (frontend is using token in memory so this is fine to keep)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000
    });

    return res.json({
      message: 'Login successful',
      token, // So frontend can read it
      user: {
        id: user._id,
        username: user.username,
        accountNumber: user.accountNumber,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
