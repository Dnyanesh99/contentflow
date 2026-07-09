import { Client } from "@upstash/qstash";
import { ENV } from "../config/env";

export type WebhookPayload = Record<string, unknown>;

export const qstashClient = new Client({
  token: ENV.QSTASH_TOKEN,
});

export const getBaseUrl = () => {
  if (ENV.VERCEL_URL && !ENV.VERCEL_URL.startsWith('http')) {
    return `https://${ENV.VERCEL_URL}`;
  }
  return ENV.VERCEL_URL;
};

/**
 * Enqueues a webhook payload into QStash for asynchronous workflow processing.
 */
export const enqueueWorkflowJob = async (
  payload: WebhookPayload,
  correlationId: string,
  action?: string,
  contentType?: string,
) => {
  return await qstashClient.publishJSON({
    url: `${getBaseUrl()}/api/queue/process-webhook`,
    body: { payload, correlationId, action, contentType },
    retries: 5,
  });
};

