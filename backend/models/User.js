const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  idNumber: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
