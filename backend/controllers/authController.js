const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { username, accountNumber, password } = req.body;

    if (!username || !accountNumber || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findOne({
      username,
      accountNumber: String(accountNumber)
    });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000
    });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        accountNumber: user.accountNumber,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
