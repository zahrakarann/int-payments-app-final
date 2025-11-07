const express = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const Payment = require('../models/Payment');

const router = express.Router();

// ✅ Get payments for logged-in user OR all payments if admin
router.get('/', auth, async (req, res) => {
  try {
    let payments;

    if (req.user.role === 'admin') {
      payments = await Payment.find().populate('userId', 'username fullName');
    } else {
      payments = await Payment.find({ userId: req.user.id });
    }

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Admin Approves Payment
router.patch('/:id/approve', auth, requireRole('admin'), async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    res.json({ message: 'Payment Approved ✅', payment });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Admin Declines Payment
router.patch('/:id/decline', auth, requireRole('admin'), async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'Declined' },
      { new: true }
    );

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    res.json({ message: 'Payment Declined ❌', payment });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
