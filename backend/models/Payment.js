const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  amount: { type: Number, required: true },

  date: { type: Date, default: Date.now },

status: { type: String, enum: ['Pending', 'Approved', 'Declined'], default: 'Pending' },

  provider: { type: String, required: true },

  currency: { type: String, required: true },

  payeeAccount: { type: String, required: true },

  swift: { type: String },

  reference: { type: String, default: "" } // ✅ added to match whitelist validation
});

module.exports = mongoose.model('Payment', PaymentSchema);
