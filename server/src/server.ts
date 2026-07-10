import express from 'express';
import webhookRoutes from './routes/webhook.routes.js';
import workflowRoutes from './routes/workflow.routes.js';
import executionRoutes from './routes/execution.routes.js';
import queueRoutes from './routes/queue.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ENV } from './config/env.js';

import { CONSTANTS } from './config/constants.js';

const app = express();
export { app };
export default app;

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

import { fileURLToPath } from 'url';

// ... other imports ...

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = ENV.PORT;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
