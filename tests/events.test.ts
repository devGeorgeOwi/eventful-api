import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/lib/prisma';
import { clearDatabase } from './helpers';

describe('Events Module', () => {
  let creatorToken: string;
  let attendeeToken: string;
  let eventId: string;

  beforeAll(async () => {
    // Clean DB
    await clearDatabase();

    // Create creator
    const creatorRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'eventcreator@test.com', password: 'password', role: 'CREATOR' });
      if (creatorRes.status !== 201) console.log('CREATOR REGISTER ERROR:', creatorRes.body);
    expect(creatorRes.status).toBe(201);
    creatorToken = creatorRes.body.data.accessToken;

    // Create attendee
    const attendeeRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'eventattendee@test.com', password: 'password', role: 'USER' });
      if (attendeeRes.status !== 201) console.log('EVENT ATTENDEE REG ERROR:', attendeeRes.body);
    expect(attendeeRes.status).toBe(201);
    attendeeToken = attendeeRes.body.data.accessToken;
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe('POST /api/events', () => {
    it('should allow creator to create event', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({
          title: 'Test Event',
          date: new Date(Date.now() + 86400000).toISOString(),
          price: 1000,
          capacity: 10,
        });
      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('Test Event');
      eventId = res.body.data.id;
    });

    it('should reject non-creator', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send({ title: 'x', date: '2026-01-01T00:00:00Z', price: 0, capacity: 1 });
      expect(res.status).toBe(401);
    });

    it('should validate request body', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/events', () => {
    it('should list events (public)', async () => {
      const res = await request(app).get('/api/events');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should allow creator to update', async () => {
      const res = await request(app)
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({ title: 'Updated Title' });
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated Title');
    });

    it('should reject non-creator update', async () => {
      const res = await request(app)
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send({ title: 'hacked' });
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should allow creator to delete', async () => {
      const res = await request(app)
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${creatorToken}`);
      expect(res.status).toBe(200);
    });
  });
});