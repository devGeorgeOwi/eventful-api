import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/lib/prisma';
import { clearDatabase } from './helpers';

describe('Notifications', () => {
  let creatorToken: string;
  let attendeeToken: string;
  let eventId: string;

  beforeAll(async () => {
    await clearDatabase();
    const cRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'ncreator@test.com', password: 'password', role: 'CREATOR' });
    creatorToken = cRes.body.data.accessToken;

    const aRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'nattendee@test.com', password: 'password', role: 'USER' });
    attendeeToken = aRes.body.data.accessToken;

    const eRes = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({
        title: 'Reminder Event',
        date: new Date(Date.now() + 86400000).toISOString(),
        price: 1000,
        capacity: 5,
      });
    eventId = eRes.body.data.id;

    // Attendee must buy a ticket to set personal reminder
    // We can mock Paystack or simply insert a ticket directly? Better to mock.
    // We'll use nock for purchase, then verify payment.
    // For brevity, we'll just insert a ticket directly via Prisma.
    await prisma.ticket.create({
      data: {
        eventId,
        userId: aRes.body.data.id, // we need the user id, can get it from DB
        qrCodeText: 'test-qr',
        paymentRef: 'test-ref',
      },
    });
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  it('should set a creator reminder', async () => {
    const res = await request(app)
      .post(`/api/events/${eventId}/reminders`)
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({ timeDelta: '1d' });
    expect(res.status).toBe(200);
    expect(res.body.data.message).toMatch(/reminder set/i);
  });

  it('should set a personal reminder', async () => {
    const res = await request(app)
      .post(`/api/tickets/${eventId}/reminders`)
      .set('Authorization', `Bearer ${attendeeToken}`)
      .send({ timeDelta: '2h' });
    expect(res.status).toBe(200);
  });

  // Test the cron logic by calling processReminders manually (if exposed) or check notifications endpoint after it runs.
});