import { Router } from 'express';
import { createExecutionController } from '../controllers/execution.controller.js';

const router = Router();
const executionController = createExecutionController();

router.get('/', executionController.getRecent);

export default router;
