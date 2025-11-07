const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const connectDB = async () => {
  // Prevent multiple connections in tests
  if (mongoose.connection.readyState === 1) return;

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.log("⚠️ No MONGO_URI provided (likely running tests). Skipping real DB connection.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    if (process.env.NODE_ENV !== 'test') {
      console.log('MongoDB connected');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message);

    // IMPORTANT: Do NOT exit the process when running tests!
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
