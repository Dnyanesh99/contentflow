import { enqueueWorkflowJob, workflowQueue } from './producer';

// Mock the BullMQ Queue implementation
jest.mock('bullmq', () => {
  return {
    Queue: jest.fn().mockImplementation(() => {
      return {
        add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
      };
    }),
  };
});

// Mock ioredis to prevent connection attempts during tests
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('ioredis', () => require('ioredis-mock'));

describe('BullMQ Producer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should enqueue a workflow job with the correct payload and options', async () => {
    const payload = { sys: { id: 'entry-123', type: 'Entry' }, fields: { title: 'Test' } };
    const correlationId = '123e4567-e89b-12d3-a456-426614174000';

    const job = await enqueueWorkflowJob(payload, correlationId);

    expect(workflowQueue.add).toHaveBeenCalledTimes(1);
    expect(workflowQueue.add).toHaveBeenCalledWith(
      'process-webhook',
      { payload, correlationId, action: undefined, contentType: undefined },
      {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      }
    );
    expect(job).toEqual({ id: 'mock-job-id' });
  });
});
