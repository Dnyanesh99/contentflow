import { Router } from 'express';
import { validate } from '../middleware/validate';
import { verifyWebhookSecret } from '../middleware/webhookAuth';
import { createWebhookController } from '../controllers/webhook.controller';
import { ContentfulWebhookSchema } from '../schemas/webhook.schema';

const router = Router();
const webhookController = createWebhookController();

router.post(
  '/contentful',
  verifyWebhookSecret,
  validate(ContentfulWebhookSchema),
  webhookController.handleContentfulWebhook
);

export default router;
