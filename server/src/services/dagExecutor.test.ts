import { jest } from '@jest/globals';
import { z } from 'zod';
import { WorkflowDefinition } from '../schemas/workflow.schema.js';

// Mock global fetch to prevent actual network calls during tests
const mockFetch = jest.fn<any>();
global.fetch = mockFetch as any;

jest.unstable_mockModule('../integrations/ai.integration.js', () => {
  return {
    AITaskConfigSchema: z.object({}).passthrough(),
    handleAIPrompt: jest.fn<any>().mockResolvedValue({ text: 'Mocked AI translation', success: true }),
  };
});

describe('DAG Executor Engine', () => {
  let executeDAG: any;

  beforeAll(async () => {
    const mod = await import('./dagExecutor.js');
    executeDAG = mod.executeDAG;
  });
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
  });

  it('should successfully execute a valid DAG from Trigger to Action without throwing', async () => {
    const mockDefinition: WorkflowDefinition = {
      nodes: [
        { id: 'node-1', type: 'Trigger' },
        { 
          id: 'node-2', 
          type: 'Slack.Notify', 
          data: { webhookUrl: 'https://hooks.slack.com/services/test-url' } 
        },
      ],
      edges: [
        { source: 'node-1', target: 'node-2' }
      ]
    };
    const mockPayload = { text: 'Test message' };

    await expect(executeDAG(mockDefinition, mockPayload)).resolves.not.toThrow();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if no Trigger node is found in the definition', async () => {
    const mockDefinition: WorkflowDefinition = {
      nodes: [
        { id: 'node-1', type: 'Slack.Notify' },
      ],
      edges: []
    };
    
    await expect(executeDAG(mockDefinition, {})).rejects.toThrow('Invalid DAG: No Trigger node found');
  });

  it('should successfully execute LLM.Prompt action across a multi-node DAG', async () => {
    const mockDefinition: WorkflowDefinition = {
      nodes: [
        { id: 'node-1', type: 'Trigger' },
        { id: 'node-2', type: 'LLM.Prompt', data: { provider: 'openai', model: 'gpt-4o', userPrompt: 'Translate this' } },
      ],
      edges: [
        { source: 'node-1', target: 'node-2' }
      ]
    };
    const mockPayload = { text: 'Translate this' };

    await expect(executeDAG(mockDefinition, mockPayload)).resolves.not.toThrow();
  });
});

