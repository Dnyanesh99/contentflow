import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { WorkflowSchema } from '../schemas/workflow.schema.js';
import { createWorkflowController } from '../controllers/workflow.controller.js';

const router = Router();
const workflowController = createWorkflowController();

router.post('/', validate(WorkflowSchema), workflowController.createOrUpdate);
router.get('/', workflowController.getAll);
router.get('/:id', workflowController.getById);
router.delete('/:id', workflowController.delete);

export default router;
