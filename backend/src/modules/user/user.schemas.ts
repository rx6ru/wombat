import { z } from 'zod';

export const UpdateUserSchema = z.object({
  username: z.string().trim().min(3, 'Invalid username'),
});
