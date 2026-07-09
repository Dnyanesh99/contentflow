import { z } from 'zod';

export const ExecutionStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export const ExecutionStatusSchema = z.nativeEnum(ExecutionStatus).describe('The current status of the workflow execution.');

export const ExecutionLogStepSchema = z.object({
  nodeId: z.string().min(1, 'Node ID is required'),
  nodeType: z.string().min(1),
  nodeLabel: z.string(),
  status: z.enum(['Success', 'Failed']),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  input: z.any().optional(),
  output: z.any().optional(),
  error: z.string().optional(),
}).describe('Log entry for a single step in execution');

export const ExecutionSchema = z.object({
  id: z.string().uuid('Execution ID must be a valid UUID'),
  workflow_id: z.string().uuid('Workflow ID must be a valid UUID'),
  correlation_id: z.string().uuid('Correlation ID must be a valid UUID'),
  status: ExecutionStatusSchema,
  logs: z.array(ExecutionLogStepSchema).default([]).describe('Execution step logs'),
  created_at: z.coerce.date().optional().describe('Execution creation timestamp'),
});

export type ExecutionStatusType = z.infer<typeof ExecutionStatusSchema>;
export type ExecutionLogStep = z.infer<typeof ExecutionLogStepSchema>;
export type Execution = z.infer<typeof ExecutionSchema>;