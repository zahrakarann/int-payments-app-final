const express = require('express');
const Payment = require('../models/Payment');
const auth = require('../middleware/auth'); // your working auth middleware

const router = express.Router();

// GET payments: both admin and staff see all, populate user info
router.get('/', auth, async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate('userId', 'username role fullName accountNumber');
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /:id/verify - admin only
router.post('/:id/verify', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') 
      return res.status(403).json({ message: 'Forbidden' });

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.status = 'Verified';
    await payment.save();

    res.json({ message: 'Payment verified', payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /submit - submit all verified payments (admin only)
router.post('/submit', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') 
      return res.status(403).json({ message: 'Forbidden' });

    const updated = await Payment.updateMany(
      { status: 'Verified' },
      { $set: { status: 'Submitted' } }
    );

    res.json({ message: `${updated.modifiedCount} payments submitted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
