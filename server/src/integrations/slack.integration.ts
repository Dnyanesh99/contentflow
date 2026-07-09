import { z } from 'zod';
import { resolveTemplate } from '../utils/templateResolver';

const SlackNodeDataSchema = z.object({
  webhookUrl: z.string().url('Invalid Webhook URL'),
  messageTemplate: z.string().default('Webhook received!'),
});

export const handleSlackNotify = async (nodeData: Record<string, unknown>, context: Record<string, unknown>) => {
  console.log('[DAG] Executing Slack.Notify action');
  
  const parseResult = SlackNodeDataSchema.safeParse(nodeData || {});
  if (!parseResult.success) {
    throw new Error(`Slack node configuration error: ${parseResult.error.message}`);
  }
  
  const { webhookUrl, messageTemplate } = parseResult.data;
  const messageText = resolveTemplate(messageTemplate, context);

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: messageText }),
  });

  if (!response.ok) {
    throw new Error(`Slack API returned status: ${response.status}`);
  }

  console.log('[DAG] Slack message sent successfully');
  
  return { 
    result: { success: true }, 
    output: { success: true, sentMessage: messageText } 
  };
};
