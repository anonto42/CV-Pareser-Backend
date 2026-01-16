import { z } from 'zod';

export const chatRequestSchema = z.object({
  prompt: z.string()
    .min(3, 'Prompt must be at least 3 characters')
    .max(5000, 'Prompt must not exceed 5000 characters'),
  includeContext: z.boolean().optional().default(true),
  topK: z.number().min(1).max(20).optional().default(5)
});

export type ChatRequestValidated = z.infer<typeof chatRequestSchema>;
