import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/lib/prisma';
import { clearDatabase } from './helpers';

describe('Auth Module', () => {
  // Clean the database before each test suite
  beforeAll(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'newuser@test.com', password: '123456', role: 'USER' });
        if (res.status !== 201) console.log('REGISTER ERROR:', res.body);
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'dupe@test.com', password: '123456', role: 'USER' });
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'dupe@test.com', password: '123456', role: 'USER' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/already registered/i);
    });

    it('should validate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'notanemail', password: '123456' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      // Ensure a known user exists
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'loginuser@test.com', password: 'correct', role: 'USER' });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'loginuser@test.com', password: 'correct' });
      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'loginuser@test.com', password: 'wrong' });
      expect(res.status).toBe(401);
    });
  });
});