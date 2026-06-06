import request from 'supertest';
import nock from 'nock';
import app from '../src/app';
import { prisma } from '../src/lib/prisma';
import { clearDatabase } from './helpers';

describe('Tickets Module', () => {
  let attendeeToken: string;
  let creatorToken: string;
  let eventId: string;
  let paymentReference: string;

  beforeAll(async () => {
    await clearDatabase();

    // Create creator
    const creatorRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'ticketcreator@test.com', password: 'password', role: 'CREATOR' });
    if (creatorRes.status !== 201) console.log('TICKET CREATOR REG ERROR:', creatorRes.body);
    expect(creatorRes.status).toBe(201);
    creatorToken = creatorRes.body.data.accessToken;

    // Create attendee
    const attendeeRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'ticketattendee@test.com', password: 'password', role: 'USER' });
    if (attendeeRes.status !== 201) console.log('TICKET ATTENDEE REG ERROR:', attendeeRes.body);
    expect(attendeeRes.status).toBe(201);
    attendeeToken = attendeeRes.body.data.accessToken;

    // Create an event
    const eventRes = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({
        title: 'Paid Event',
        date: new Date(Date.now() + 86400000).toISOString(),
        price: 5000,
        capacity: 2,
      });
    if (eventRes.status !== 201) console.log('EVENT CREATE ERROR:', eventRes.body);
    expect(eventRes.status).toBe(201);
    eventId = eventRes.body.data.id;
  });

  afterAll(async () => {
    await clearDatabase();
    nock.cleanAll();
    await prisma.$disconnect();
  });

  describe('POST /api/tickets/purchase', () => {
    it('should initiate payment and return authorization URL', async () => {
      nock('https://api.paystack.co')
        .post('/transaction/initialize')
        .reply(200, {
          status: true,
          data: { authorization_url: 'https://paystack.com/fake', reference: 'ref-fake' },
        });

      const res = await request(app)
        .post('/api/tickets/purchase')
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send({ eventId });
      expect(res.status).toBe(200);
      expect(res.body.data.authorization_url).toBeDefined();
      paymentReference = res.body.data.reference; // save for later
    });
  });

  describe('GET /api/tickets/verify-payment', () => {
    it('should verify payment and create ticket', async () => {
      nock('https://api.paystack.co')
        .get(`/transaction/verify/${paymentReference}`)
        .reply(200, {
          status: true,
          data: { status: 'success', id: 123456 },
        });

      const res = await request(app)
        .get(`/api/tickets/verify-payment?reference=${paymentReference}`);
      expect(res.status).toBe(200);
      expect(res.body.data.qrCodeText).toBeDefined();
      // store qr for scan test
      (global as any).ticketQr = res.body.data.qrCodeText;
    });
  });

  describe('POST /api/tickets/scan', () => {
    it('should verify a valid QR code', async () => {
      const qr = (global as any).ticketQr;
      const res = await request(app)
        .post('/api/tickets/scan')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({ qrCodeText: qr });
      expect(res.status).toBe(200);
      expect(res.body.data.valid).toBe(true);
    });

    it('should reject already used QR', async () => {
      const qr = (global as any).ticketQr;
      const res = await request(app)
        .post('/api/tickets/scan')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({ qrCodeText: qr });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/already used/i);
    });
  });
});