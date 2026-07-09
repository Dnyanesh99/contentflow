import { z } from 'zod';

export const ProcessWebhookJobSchema = z.object({
  payload: z.record(z.string(), z.unknown()),
  correlationId: z.string().uuid(),
  action: z.string().optional(),
  contentType: z.string().optional(),
});

export const ExecuteWorkflowJobSchema = z.object({
  payload: z.record(z.string(), z.unknown()),
  correlationId: z.string().uuid(),
  workflowId: z.string().uuid(),
  definition: z.any(),
});
