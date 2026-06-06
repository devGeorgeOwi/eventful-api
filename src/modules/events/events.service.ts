import { prisma } from '../../lib/prisma';
import { BadRequestError, NotFoundError } from '../../common/errors/app-error';
import { CreateEventInput, UpdateEventInput } from './events.validation';

export class EventsService {
    async create(creatorId: string, data: CreateEventInput) {
        // Check for duplicate event? Not required, but can prevent accidental double creation
        const event = await prisma.event.create({
            data: {
                ...data,
                date: new Date(data.date),
                creatorId,
            },
        });
        return event;
    }

    async findAll(query: { page: number; limit: number; search?: string }) {
        const { page, limit, search } = query;
        const skip = (page - 1) * limit;

        const where = search
            ? { title: { contains: search, mode: 'insensitive' as const } }
            : {};

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                skip,
                take: limit,
                orderBy: { date: 'asc' },
                include: {
                    creator: { select: { id: true, email: true } }, // only needed fields
                    _count: { select: { tickets: true } }, // how many tickets sold
                },
            }),
            prisma.event.count({ where }),
        ]);

        return {
            data: events,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findById(id: string) {
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                creator: { select: { id: true, email: true } },
                _count: { select: { tickets: true } },
            },
        });
        if (!event) 
            throw new NotFoundError('Event not found');
            return event;
    }

        async update(eventId: string, userId: string, data: UpdateEventInput) {
            const event = await prisma.event.findUnique({ where: { id: eventId } });
            if (!event) throw new NotFoundError('Event not found');
            if (event.creatorId !== userId) throw new BadRequestError('Only the creator can update this event');

            const updated = await prisma.event.update({
                where: { id: eventId },
                data: {
                    ...data,
                    date: data.date ? new Date(data.date) : undefined,
                },
            });
            return updated; 
        }

        async delete(eventId: string, userId: string) {
            const event = await prisma.event.findUnique({ where: { id: eventId } });
            if (!event) throw new NotFoundError('Event not found');
            if (event.creatorId !== userId) throw new BadRequestError('Only the creator can delete this event');

            await prisma.event.delete({ where: { id: eventId } });
            return { message: 'Event deleted successfully' };
        }
}

    export const eventsService = new EventsService();
