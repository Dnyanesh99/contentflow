import { handleSlackNotify } from "./slack.integration.js";
import { handleContentfulWriteBack } from "./contentful.integration.js";
import { handleCustomCode } from "./custom.integration.js";
import { handleAIPrompt, AITaskConfigSchema } from "./ai.integration.js";

type IntegrationHandler = (
  nodeData: Record<string, unknown>,
  context: Record<string, any>,
) => Promise<{ result: any; output: any }>;

export const IntegrationRegistry: Record<string, IntegrationHandler> = {
  "Slack.Notify": handleSlackNotify,
  "Contentful.WriteBack": handleContentfulWriteBack,
  "LLM.Prompt": async (nodeData, context) => {
    const parseResult = AITaskConfigSchema.safeParse(nodeData || {});
    if (!parseResult.success) {
      throw new Error(
        `LLM.Prompt configuration error: ${parseResult.error.message}`,
      );
    }
    const result = await handleAIPrompt(parseResult.data, context);
    return { result, output: result };
  },
  "Custom.Code": handleCustomCode,
};
