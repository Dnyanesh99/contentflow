import request from 'supertest';
import { app } from '../server';

jest.mock('../queue/producer', () => ({
  enqueueWorkflowJob: jest.fn().mockResolvedValue(true),
}));

describe('Webhook Routes', () => {
  describe('POST /api/webhooks/contentful', () => {
    it('should return 202 Accepted for a valid payload and return a correlation_id', async () => {
      const validPayload = {
        sys: {
          id: 'entry-123',
          type: 'Entry',
        },
        fields: {
          title: 'Hello World',
        }
      };

      const response = await request(app)
        .post('/api/webhooks/contentful')
        .send(validPayload);

      expect(response.status).toBe(202);
      expect(response.body).toHaveProperty('message', 'Accepted');
      expect(response.body).toHaveProperty('correlation_id');
      
      // Ensure it's a valid string (UUID)
      expect(typeof response.body.correlation_id).toBe('string');
      expect(response.body.correlation_id.length).toBeGreaterThan(0);
    });

    it('should return 400 Bad Request with strict JSON error on schema validation failure', async () => {
      // Invalid payload: missing 'type' in sys
      const invalidPayload = {
        sys: {
          id: 'entry-123',
        },
      };

      const response = await request(app)
        .post('/api/webhooks/contentful')
        .send(invalidPayload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation Error');
      expect(response.body).toHaveProperty('details');
      expect(typeof response.body.details).toBe('object');
    });

    it('should return 401 when in production and no secrets are configured', async () => {
      const { ENV } = require('../config/env');
      const originalNodeEnv = ENV.NODE_ENV;
      ENV.NODE_ENV = 'production';

      const validPayload = {
        sys: { id: 'entry-123', type: 'Entry' },
      };

      try {
        const response = await request(app)
          .post('/api/webhooks/contentful')
          .send(validPayload);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Unauthorized: Webhook security is not configured');
      } finally {
        ENV.NODE_ENV = originalNodeEnv;
      }
    });
  });
});
