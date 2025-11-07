const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Payment = require('../models/Payment');
const User = require('../models/User');

// ✅ Load .env correctly
dotenv.config({ path: __dirname + '/../.env' });

async function seedPayments() {
  try {
    // ✅ Ensure we have a DB connection string
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is missing in .env!");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Payment.deleteMany({});
    console.log('🧹 Removed existing payments');

    const admin = await User.findOne({ username: 'adminuser' });
    const staff = await User.findOne({ username: 'staffuser' });

    if (!admin || !staff) {
      console.log('❌ Admin or staff user not found. Seed users first with: npm run seed:users');
      process.exit(1);
    }

    const paymentsData = [
      { userId: admin._id, amount: 500, currency: 'ZAR', provider: 'Standard Bank', payeeAccount: '1234567890', swift: 'SBZAZAJJ', status: 'Pending', date: new Date() },
      { userId: admin._id, amount: 1000, currency: 'ZAR', provider: 'Amazon', payeeAccount: '0987654321', swift: 'AMZNZAJJ', status: 'Pending', date: new Date() },
      { userId: staff._id, amount: 200, currency: 'ZAR', provider: 'Netflix', payeeAccount: '1122334455', swift: 'NFLXZAJJ', status: 'Pending', date: new Date() },
      { userId: staff._id, amount: 300, currency: 'ZAR', provider: 'Spotify', payeeAccount: '2233445566', swift: 'SPOTZAJJ', status: 'Pending', date: new Date() }
    ];

    await Payment.insertMany(paymentsData);
    console.log('✅ Payments seeded successfully');

  } catch (err) {
    console.error('❌ Seeding Error:', err);
  } finally {
    mongoose.connection.close();
    console.log('🔒 MongoDB connection closed');
  }
}

seedPayments();
