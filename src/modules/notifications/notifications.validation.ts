import { z } from 'zod';

export const setReminderSchema = z.object({
  delta: z
    .string()
    .regex(/^\d+[hdm]$/, 'Must be like 1d, 2h, 30m'),
});