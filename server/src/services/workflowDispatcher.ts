import { WorkflowRepository } from '../repositories/workflow.repository.js';
import { WorkflowDefinition } from '../schemas/workflow.schema.js';
import { qstashClient, getBaseUrl } from '../queue/producer.js';

export const dispatchWebhookToWorkflows = async (
  payload: any,
  correlationId: string,
  action?: string,
  contentType?: string,
  triggerType: string = 'contentful'
): Promise<void> => {
  const rows = await WorkflowRepository.findByTriggerType(triggerType);

  if (rows.length === 0) {
    console.log(`[Dispatcher] No active workflows found for trigger_type: ${triggerType}. Skipping dispatch.`);
    return;
  }

  for (const row of rows) {
    const workflowId = row.id;
    const definition: WorkflowDefinition = row.definition;

    const triggerNode = definition.nodes.find((n) => n.type === 'Trigger');
    if (triggerNode) {
      const filterContentType = triggerNode.data?.contentType as string;
      const filterAction = triggerNode.data?.action as string;
      const filterField = triggerNode.data?.triggerField as string;

      if (filterContentType && contentType && contentType !== filterContentType) continue;
      if (filterAction && action && action !== filterAction) continue;
      
      if (filterField) {
        const fieldKey = filterField.replace('fields.', '');
        const fieldsObj = payload.fields as Record<string, any> | undefined;
        if (!fieldsObj || !(fieldKey in fieldsObj)) continue;
      }
    }

    await qstashClient.publishJSON({
      url: `${getBaseUrl()}/api/queue/execute-workflow`,
      body: { payload, correlationId, workflowId, definition },
      retries: 5
    });
  }
};
