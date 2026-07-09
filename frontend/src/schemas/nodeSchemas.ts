import { z } from 'zod';

export const baseSchema = {
  label: z.string().min(1, 'sidebar.validation.labelRequired'),
};

export const nodeSchemaRegistry: Record<string, z.ZodTypeAny> = {
  Trigger: z.object({
    ...baseSchema,
    contentType: z.string().optional(),
    action: z.string().optional(),
    triggerField: z.string().optional(),
  }),
  'Slack.Notify': z.object({
    ...baseSchema,
    webhookUrl: z
      .string()
      .min(1, 'sidebar.validation.slackUrlRequired')
      .url('sidebar.validation.slackUrlInvalid'),
    messageTemplate: z.string().min(1, 'sidebar.validation.slackTemplateRequired'),
  }),
  'LLM.Prompt': z.object({
    ...baseSchema,
    provider: z.enum(['openai', 'anthropic', 'ollama']),
    model: z.string().min(1, 'sidebar.validation.aiModelRequired'),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, 'sidebar.validation.aiPromptRequired'),
    baseUrl: z.string().optional(),
  }),
  'Contentful.WriteBack': z.object({
    ...baseSchema,
    entryId: z.string().min(1, 'sidebar.validation.cfEntryRequired'),
    field: z.string().min(1, 'sidebar.validation.cfFieldRequired'),
    locale: z.string().min(1, 'sidebar.validation.cfLocaleRequired'),
    value: z.string().min(1, 'sidebar.validation.cfValueRequired'),
  }),
  'Custom.Code': z.object({
    ...baseSchema,
    code: z.string().optional(),
  }),
};

export function getValidationSchema(nodeType: string): z.ZodTypeAny {
  return nodeSchemaRegistry[nodeType] ?? z.object(baseSchema);
}
