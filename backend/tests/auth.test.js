jest.setTimeout(10000);
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' });
const connectDB = require('../config/db');

beforeAll(async () => {
  jest.setTimeout(30000);
  await connectDB();
});

afterAll(async () => {
  await mongoose.disconnect(); // don't drop DB
});

describe('Auth Endpoints', () => {
  it('should reject login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'wronguser', accountNumber: '1234567890', password: 'wrongpass' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  // You can add real seeded users from your test DB here
});
