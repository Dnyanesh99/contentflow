import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { verifyWebhookSecret } from '../middleware/webhookAuth.js';
import { createWebhookController } from '../controllers/webhook.controller.js';
import { ContentfulWebhookSchema } from '../schemas/webhook.schema.js';

const router = Router();
const webhookController = createWebhookController();

router.post(
  '/contentful',
  verifyWebhookSecret,
  validate(ContentfulWebhookSchema),
  webhookController.handleContentfulWebhook
);

export default router;
