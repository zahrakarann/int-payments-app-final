const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });


const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('MONGO_URI not set, skipping real MongoDB connection (likely running tests)');
    return;
  }

  try {
    console.log('🧠 Using DB:', process.env.MONGO_URI);
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
