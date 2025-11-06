jest.setTimeout(10000);
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
require('dotenv').config({ path: '.env.test' });
const connectDB = require('../config/db');

beforeAll(async () => {
  jest.setTimeout(30000);
  await connectDB();
});

afterAll(async () => {
  await mongoose.disconnect(); // leave DB intact
});

describe('Payments Endpoints', () => {
  it('should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/payments');
    expect(res.statusCode).toBe(401);
  });

  // You can test with real tokens from your test DB
});
