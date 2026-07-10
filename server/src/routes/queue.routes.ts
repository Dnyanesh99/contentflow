import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { verifyQStashSignature } from '../middleware/qstashAuth.js';
import { processWebhookJob, executeWorkflowJob } from '../controllers/queue.controller.js';
import { ProcessWebhookJobSchema, ExecuteWorkflowJobSchema } from '../schemas/queue.schema.js';

const router = Router();

router.post(
  '/process-webhook',
  verifyQStashSignature,
  validate(ProcessWebhookJobSchema),
  processWebhookJob
);

router.post(
  '/execute-workflow',
  verifyQStashSignature,
  validate(ExecuteWorkflowJobSchema),
  executeWorkflowJob
);

export default router;
