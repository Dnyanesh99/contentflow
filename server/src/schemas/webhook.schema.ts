import { z } from 'zod';

export const ContentfulWebhookSchema = z.object({
  sys: z.object({
    id: z.string(),
    type: z.string(),
  }).passthrough(),
}).passthrough();

export const ContentfulPayloadSchema = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.string(),
      }).optional()
    }).optional()
  }).optional()
}).passthrough();
