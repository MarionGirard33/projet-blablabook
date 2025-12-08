import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.email().max(100),
  password: z.string().min(6).max(255),
  username: z.string().max(100).optional(),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});
