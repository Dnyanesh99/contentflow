import { Worker, Job } from 'bullmq';
import { z } from 'zod';
import { redisConnection } from './connection';
import { dispatchWebhookToWorkflows } from '../services/workflowDispatcher';
import { runWorkflowExecution } from '../services/workflowRunner';
import { startLogRetentionCleanup } from '../services/retentionService';

const ProcessWebhookJobSchema = z.object({
  payload: z.record(z.string(), z.unknown()),
  correlationId: z.string().uuid(),
  action: z.string().optional(),
  contentType: z.string().optional(),
});

const ExecuteWorkflowJobSchema = z.object({
  payload: z.record(z.string(), z.unknown()),
  correlationId: z.string().uuid(),
  workflowId: z.string().uuid(),
  definition: z.any(),
});

export const workflowWorker = new Worker(
  'workflow-queue',
  async (job: Job) => {
    if (job.name === 'process-webhook') {
      const parseResult = ProcessWebhookJobSchema.safeParse(job.data);
      if (!parseResult.success) {
        console.error(`[Worker] Validation failed for job ${job.id}:`, parseResult.error.message);
        throw new Error(`Invalid process-webhook job data: ${parseResult.error.message}`);
      }
      
      const { payload, correlationId, action, contentType } = parseResult.data;
      console.log(`[Worker] Processing job ${job.id} (Correlation ID: ${correlationId})`);
      await dispatchWebhookToWorkflows(payload, correlationId, action, contentType, 'contentful');
      console.log(`[Worker] Webhook ${correlationId} fanned out successfully`);
      return;
    }

    if (job.name === 'execute-workflow') {
      const parseResult = ExecuteWorkflowJobSchema.safeParse(job.data);
      if (!parseResult.success) {
        console.error(`[Worker] Validation failed for job ${job.id}:`, parseResult.error.message);
        throw new Error(`Invalid execute-workflow job data: ${parseResult.error.message}`);
      }

      const { payload, correlationId, workflowId, definition } = parseResult.data;
      console.log(`[Worker] Executing workflow ${workflowId} for correlation ${correlationId}`);
      await runWorkflowExecution(workflowId, correlationId, definition, payload);
      console.log(`[Worker] Job ${job.id} completed successfully`);
      return;
    }
    
    console.warn(`[Worker] Unknown job name: ${job.name}`);
  },
  {
    connection: redisConnection as any,
    limiter: {
      // Respect Contentful CMA rate limits (7-10 req/sec)
      max: 8,
      duration: 1000,
    }
  }
);

if (process.env.NODE_ENV !== 'test') {
  startLogRetentionCleanup();
}

workflowWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed after retries:`, err);
});
