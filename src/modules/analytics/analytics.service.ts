import { prisma } from '../../lib/prisma';
import { NotFoundError } from '../../common/errors/app-error';

export class AnalyticsService {
  async forEvent(eventId: string, creatorId: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.creatorId !== creatorId) throw new NotFoundError('Event not found');

    const [ticketsSold, attendees, revenue] = await Promise.all([
      prisma.ticket.count({ where: { eventId } }),
      prisma.ticket.count({ where: { eventId, isUsed: true } }),
      prisma.payment.aggregate({
        where: { eventId, status: 'success' },
        _sum: { amount: true },
      }),
    ]);

    return {
      ticketsSold,
      attendees,
      revenue: revenue._sum.amount || 0,
    };
  }

  async overall(creatorId: string) {
    const events = await prisma.event.findMany({
      where: { creatorId },
      select: { id: true },
    });

    if (events.length === 0) {
      return { ticketsSold: 0, attendees: 0, revenue: 0 };
    }

    let ticketsSold = 0;
    let attendees = 0;
    let revenue = 0;

    for (const event of events) {
      const [t, a, r] = await Promise.all([
        prisma.ticket.count({ where: { eventId: event.id } }),
        prisma.ticket.count({ where: { eventId: event.id, isUsed: true } }),
        prisma.payment.aggregate({
          where: { eventId: event.id, status: 'success' },
          _sum: { amount: true },
        }),
      ]);
      ticketsSold += t;
      attendees += a;
      revenue += (r._sum.amount || 0);
    }

    return { ticketsSold, attendees, revenue };
  }
}

export const analyticsService = new AnalyticsService();