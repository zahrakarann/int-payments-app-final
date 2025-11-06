jest.setTimeout(10000);
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' });
const connectDB = require('../config/db');

beforeAll(async () => {
  jest.setTimeout(30000);
  await connectDB();
});

afterAll(async () => {
  await mongoose.disconnect(); // don't touch DB
});

describe('User model basic checks', () => {
  it('should connect to the test database', async () => {
    const state = mongoose.connection.readyState; // 1 = connected
    expect(state).toBe(1);
  });
});
