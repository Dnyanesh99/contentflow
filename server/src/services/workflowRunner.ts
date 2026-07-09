import { ExecutionRepository } from '../repositories/execution.repository.js';
import { executeDAG } from './dagExecutor.js';
import { WorkflowDefinition } from '../schemas/workflow.schema.js';
import { scrubPII } from '../utils/scrub.js';
import { v4 as uuidv4 } from 'uuid';
import { ExecutionStatus } from '../schemas/execution.schema.js';

export const runWorkflowExecution = async (
  workflowId: string,
  correlationId: string,
  definition: WorkflowDefinition,
  payload: any
): Promise<void> => {
  const executionId = uuidv4();
  
  await ExecutionRepository.create(executionId, workflowId, correlationId, ExecutionStatus.RUNNING);

  let logs: any[] = [];
  try {
    logs = await executeDAG(definition, payload);
    const scrubbedLogs = scrubPII(logs);
    await ExecutionRepository.updateStatusAndLogs(executionId, ExecutionStatus.SUCCESS, JSON.stringify(scrubbedLogs));
  } catch (execError: any) {
    const storedLogs = execError.logs || logs;
    const scrubbedLogs = scrubPII(storedLogs);
    await ExecutionRepository.updateStatusAndLogs(executionId, ExecutionStatus.FAILED, JSON.stringify(scrubbedLogs));
    throw execError;
  }
};
