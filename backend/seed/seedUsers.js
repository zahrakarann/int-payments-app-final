require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/int-payments-app';

const seedUsers = async () => {
  try {
    console.log(' Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log(' MongoDB connected');

    console.log(' Removing existing users...');
    await User.deleteMany({});

    const users = [
      {
        fullName: "Finance Admin",
        username: "adminuser",
        idNumber: "1234567890123",
        accountNumber: "1234567890",
        password: bcrypt.hashSync("Admin@123", 10), //  MATCH LOGIN PW
        role: "admin"
      },
      {
        fullName: "Employee Payments Staff",
        username: "staffuser",
        idNumber: "9876543210987",
        accountNumber: "0987654321",
        password: bcrypt.hashSync("Staff@123", 10), //  MATCH LOGIN PW
        role: "employee"
      }
    ];

    console.log(' Inserting new users...');
    await User.insertMany(users);

    console.log(' Seeding complete! Inserted users:');
    console.table(users.map(u => ({
      fullName: u.fullName,
      username: u.username,
      role: u.role
    })));
  } catch (err) {
    console.error(' Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log(' MongoDB disconnected');
  }
};

seedUsers();
