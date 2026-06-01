import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['USER', 'CREATOR']).optional().default('USER'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});