const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Payment = require('../models/Payment');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

async function seedPayments() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to DB');

    await Payment.deleteMany({});
    console.log('Existing payments removed');

    const admin = await User.findOne({ username: 'adminuser' });
    const staff = await User.findOne({ username: 'staffuser' });

    if (!admin || !staff) {
      console.log('Admin or staff user not found. Add them first with proper role.');
      process.exit(1);
    }

    const paymentsData = [
      { userId: admin._id, amount: 500, currency: 'ZAR', provider: 'Standard Bank', payeeAccount: '1234567890', swift: 'SBZAZAJJ', status: 'Pending' },
      { userId: admin._id, amount: 1000, currency: 'ZAR', provider: 'Amazon', payeeAccount: '0987654321', swift: 'AMZNZAJJ', status: 'Pending' },
      { userId: staff._id, amount: 200, currency: 'ZAR', provider: 'Netflix', payeeAccount: '1122334455', swift: 'NFLXZAJJ', status: 'Pending' },
      { userId: staff._id, amount: 300, currency: 'ZAR', provider: 'Spotify', payeeAccount: '2233445566', swift: 'SPOTZAJJ', status: 'Pending' },
    ];

    await Payment.insertMany(paymentsData);
    console.log('Payments seeded successfully');

    mongoose.connection.close();
    console.log('DB connection closed');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedPayments();