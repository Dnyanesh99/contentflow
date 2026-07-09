import { Router } from 'express';
import { validate } from '../middleware/validate';
import { verifyQStashSignature } from '../middleware/qstashAuth';
import { processWebhookJob, executeWorkflowJob } from '../controllers/queue.controller';
import { ProcessWebhookJobSchema, ExecuteWorkflowJobSchema } from '../schemas/queue.schema';

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
