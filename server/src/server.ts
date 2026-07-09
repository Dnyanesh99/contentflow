import express from 'express';
import webhookRoutes from './routes/webhook.routes';
import workflowRoutes from './routes/workflow.routes';
import executionRoutes from './routes/execution.routes';
import queueRoutes from './routes/queue.routes';
import { errorHandler } from './middleware/errorHandler';
import { ENV } from './config/env';

import { CONSTANTS } from './config/constants';

export const app = express();

app.use(express.json({
  type: ['application/json', CONSTANTS.CONTENTFUL_MANAGEMENT_CONTENT_TYPE],
  verify: (req, _res, buf) => {
    (req as express.Request & { rawBody?: string }).rawBody = buf.toString();
  }
}));

app.use((req, res, next) => {
  const allowedOrigin = ENV.NODE_ENV === 'production' ? ENV.FRONTEND_URL : '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-contentflow-secret, x-contentful-secret, x-contentful-signature');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use('/api/webhooks', webhookRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/queue', queueRoutes);

app.use(errorHandler);

if (require.main === module) {
  const PORT = ENV.PORT;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
