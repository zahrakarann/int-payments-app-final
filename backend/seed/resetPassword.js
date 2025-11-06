require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI;
const username = 'staffuser';
const newPassword = 'StaffSecure!2025';

async function resetPassword() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    console.log(`Password for ${username} reset successfully.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

resetPassword();
