import { Router } from 'express';
import { validate } from '../middleware/validate';
import { WorkflowSchema } from '../schemas/workflow.schema';
import { createWorkflowController } from '../controllers/workflow.controller';

const router = Router();
const workflowController = createWorkflowController();

router.post('/', validate(WorkflowSchema), workflowController.createOrUpdate);
router.get('/', workflowController.getAll);
router.get('/:id', workflowController.getById);
router.delete('/:id', workflowController.delete);

export default router;
