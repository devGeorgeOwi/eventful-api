import crypto from 'crypto';
import { prisma } from '../../lib/prisma';
import { paystack } from '../../lib/paystack';
import { BadRequestError, NotFoundError } from '../../common/errors/app-error';

export class TicketsService {
  async purchase(userId: string, eventId: string) {
    // Fetch user email for Paystack
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user) throw new NotFoundError('User not found');
    const userEmail = user.email;
    
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundError('Event not found');
    if (event.date < new Date()) throw new BadRequestError('Event already passed');
    if (event.price < 0) throw new BadRequestError('Invalid event price');

    // Capacity check
    const sold = await prisma.ticket.count({ where: { eventId } });
    if (sold >= event.capacity) throw new BadRequestError('No tickets available');

    const reference = `EVT-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    // Create pending payment
    await prisma.payment.create({
      data: {
        userId,
        eventId,
        amount: event.price,
        reference,
        status: 'pending',
      },
    });

    // Initiate Paystack
    const ps = await paystack.initialize(userEmail, event.price, reference);
    if (!ps.status) throw new Error('Payment initialization failed');

    return {
      reference,
      authorization_url: ps.data.authorization_url,
    };
  }

  async verifyAndCreateTicket(reference: string) {
    const payment = await prisma.payment.findUnique({ where: { reference } });
    if (!payment) throw new NotFoundError('Payment not found');
    if (payment.status === 'success') throw new BadRequestError('Already processed');

    // Verify from Paystack
    const ps = await paystack.verify(reference);
    if (!ps.status || ps.data.status !== 'success') {
      throw new BadRequestError('Payment not completed');
    }

    // Atomic: update payment + create ticket
    const result = await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { reference },
        data: { status: 'success', paystackRef: String(ps.data.id) },
      });

      const qrCodeText = crypto.randomUUID();
      const ticket = await tx.ticket.create({
        data: {
          eventId: payment.eventId,
          userId: payment.userId,
          qrCodeText,
          paymentRef: reference,
        },
      });
      return ticket;
    });

    return result;
  }

  async verifyQrCode(qrCodeText: string, userId: string) {
    const ticket = await prisma.ticket.findUnique({
      where: { qrCodeText },
      include: { event: true },
    });
    if (!ticket) throw new NotFoundError('Invalid ticket');
    if (ticket.isUsed) throw new BadRequestError('Ticket already used');
    // Only the event creator can scan
    if (ticket.event.creatorId !== userId)
      throw new BadRequestError('Only event creator can verify tickets');

    await prisma.ticket.update({ where: { id: ticket.id }, data: { isUsed: true } });
    return { valid: true, ticketId: ticket.id, eventTitle: ticket.event.title };
  }

  async getUserTickets(userId: string) {
    return prisma.ticket.findMany({
      where: { userId },
      include: { event: true },
    });
  }
}

export const ticketsService = new TicketsService();