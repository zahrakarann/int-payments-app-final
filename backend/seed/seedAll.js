//const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Payment = require('../models/Payment');
require('dotenv').config();
const connectDB = require('../config/db');

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Payment.deleteMany();

    // users
    const users = [
      { 
        fullName: 'John Doe',
        idNumber: '8001015009087', // 13 digits
        username: 'john123', 
        accountNumber: '1234567890', 
        password: await bcrypt.hash('password1', 10) 
      },
      { 
        fullName: 'Jane Smith',
        idNumber: '9002026009087',
        username: 'jane456', 
        accountNumber: '9876543210', 
        password: await bcrypt.hash('password2', 10) 
      },

/* {
  "fullName": "Alice Wonderland",
  "idNumber": "9103037009087",
  "username": "alice789",
  "accountNumber": "1122334455",
  "password": "password3"
},
*/

    ];

    const insertedUsers = await User.insertMany(users);

    // payments
    const payments = [
  { userId: insertedUsers[0]._id, amount: 1200.5, status: 'Completed', provider: 'Amazon', currency: 'ZAR', date: new Date(), payeeAccount: '9876543211', swift: 'AMZ123ZA' },
  { userId: insertedUsers[1]._id, amount: 500, status: 'Pending', provider: 'Netflix', currency: 'ZAR', date: new Date(), payeeAccount: '1234567891', swift: 'NFLXZA12' },
  { userId: insertedUsers[0]._id, amount: 300, status: 'Completed', provider: 'Spotify', currency: 'ZAR', date: new Date(), payeeAccount: '9876543212', swift: 'SPOTZA34' },
  { userId: insertedUsers[1]._id, amount: 150, status: 'Failed', provider: 'Apple', currency: 'ZAR', date: new Date(), payeeAccount: '1234567892', swift: 'APLZA56' },
];

    await Payment.insertMany(payments);

    console.log('Users and Payments seeded!');
    process.exit();
  } catch (err) {
    console.error('Seeder error:', err);
    process.exit(1);
  }
};

seedData();