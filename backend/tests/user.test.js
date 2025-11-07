const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

beforeAll(async () => {
  // Insert one known test user
  await User.deleteMany({});
  await User.create({
    fullName: "Test Admin",
    username: "adminuser",
    idNumber: "1234567890123",
    accountNumber: "1234567890",
    password: bcrypt.hashSync("Admin@123", 10),
    role: "admin"
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Endpoints', () => {

  it('should reject login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'wronguser',
        accountNumber: '1234567890',
        password: 'wrongpass'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('should allow login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'adminuser',
        accountNumber: '1234567890',
        password: 'Admin@123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('admin');
  });

});
