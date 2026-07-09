import { Request, Response, NextFunction } from 'express';
import { dispatchWebhookToWorkflows } from '../services/workflowDispatcher';
import { runWorkflowExecution } from '../services/workflowRunner';

export const processWebhookJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { payload, correlationId, action, contentType } = req.body;
    await dispatchWebhookToWorkflows(payload, correlationId, action, contentType, 'contentful');
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const executeWorkflowJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { payload, correlationId, workflowId, definition } = req.body;
    await runWorkflowExecution(workflowId, correlationId, definition, payload);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
