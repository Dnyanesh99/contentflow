import { Router } from 'express';
import { createExecutionController } from '../controllers/execution.controller';

const router = Router();
const executionController = createExecutionController();

router.get('/', executionController.getRecent);

export default router;
