import { z } from 'zod';

export const purchaseSchema = z.object({
  eventId: z.string().uuid(),
});