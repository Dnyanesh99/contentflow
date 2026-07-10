import { WorkflowSchema } from './workflow.schema.js';
import { ExecutionSchema, ExecutionStatus } from './execution.schema.js';

describe('Zod Schemas', () => {
  describe('WorkflowSchema', () => {
    it('should validate a correct workflow object', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Onboarding Workflow',
        trigger_type: 'WEBHOOK',
        definition: {
          nodes: [
            { id: '1', type: 'Trigger' },
            { id: '2', type: 'Slack.Notify' }
          ],
          edges: [
            { source: '1', target: '2' }
          ]
        },
        is_active: true,
      };
      
      const result = WorkflowSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail on invalid uuid format', () => {
      const invalidData = {
        id: 'invalid-uuid',
        name: 'Onboarding Workflow',
        trigger_type: 'WEBHOOK',
        definition: {},
        is_active: true,
      };
      
      const result = WorkflowSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('ExecutionSchema', () => {
    it('should validate a correct execution object', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        workflow_id: '123e4567-e89b-12d3-a456-426614174001',
        correlation_id: '123e4567-e89b-12d3-a456-426614174002',
        status: ExecutionStatus.RUNNING,
        logs: [],
        created_at: new Date().toISOString(),
      };
      
      const result = ExecutionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail on invalid status enum', () => {
      const invalidData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        workflow_id: '123e4567-e89b-12d3-a456-426614174001',
        correlation_id: '123e4567-e89b-12d3-a456-426614174002',
        status: 'UNKNOWN_STATUS',
      };
      
      const result = ExecutionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
