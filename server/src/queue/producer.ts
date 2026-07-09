import { Queue } from "bullmq";
import { redisConnection } from "./connection";

export type WebhookPayload = Record<string, unknown>;

export const workflowQueue = new Queue("workflow-queue", {
  connection: redisConnection as unknown as any,
});

/**
 * Enqueues a webhook payload into BullMQ for asynchronous workflow processing.
 */
export const enqueueWorkflowJob = async (
  payload: WebhookPayload,
  correlationId: string,
  action?: string,
  contentType?: string,
) => {
  return await workflowQueue.add(
    "process-webhook",
    { payload, correlationId, action, contentType },
    {
      attempts: 5, // Retry for rate limit tolerance
      backoff: {
        type: "exponential",
        delay: 2000, // milliseconds
      },
    },
  );
};
