import { z } from 'zod';

export const createEventSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    date: z.string().datetime('Invalid date format'),
    location: z.string().optional(),
    price: z.number().nonnegative('Price must be >= 0'),
    capacity: z.number().int().positive('Capacity must be a positive integer'),
});

export const updateEventSchema = createEventSchema.partial();

export const eventQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    search: z.string().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;