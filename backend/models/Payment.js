const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' },
  provider: String,
  currency: String,
  payeeAccount: String,
  swift: String,
});

module.exports = mongoose.model('Payment', PaymentSchema);
