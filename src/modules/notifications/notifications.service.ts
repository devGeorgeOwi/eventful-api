import { prisma } from '../../lib/prisma';
import { NotFoundError } from '../../common/errors/app-error';

export class NotificationsService {
  // Creator sets a global reminder for the event
  async setEventReminder(eventId: string, creatorId: string, delta: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.creatorId !== creatorId)
      throw new NotFoundError('Event not found');

    return prisma.reminder.create({
      data: {
        eventId,
        userId: null, // applies to all attendees
        delta,
        type: 'CREATOR_SET',
      },
    });
  }

  // Attendee sets a personal reminder
  async setUserReminder(eventId: string, userId: string, delta: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundError('Event not found');

    return prisma.reminder.create({
      data: {
        eventId,
        userId,
        delta,
        type: 'USER_SET',
      },
    });
  }

  // Called by the cron job – returns reminders that should fire right now
  async getDueReminders() {
  const now = new Date();
  const all = await prisma.reminder.findMany({
    include: { event: true },
  });

  return all.filter((r) => {
    const eventDate = new Date(r.event.date);
    const deltaMs = this.parseDelta(r.delta);
    if (!deltaMs) return false;
    const triggerTime = new Date(eventDate.getTime() - deltaMs);
    // Fire if trigger time has passed
    return triggerTime <= now;
  });
}

  private parseDelta(delta: string): number | null {
    const match = delta.match(/^(\d+)([hdm])$/);
    if (!match) return null;
    const value = parseInt(match[1], 10);
    if (match[2] === 'm') return value * 60_000;
    if (match[2] === 'h') return value * 3600_000;
    if (match[2] === 'd') return value * 86400_000;
    return null;
  }
}

export const notificationsService = new NotificationsService();