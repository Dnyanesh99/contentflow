import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { ENV } from "../config/env";
import { CONSTANTS } from "../config/constants";
import { resolveTemplate } from "../utils/templateResolver";

export const AITaskConfigSchema = z.object({
  provider: z.enum(["openai", "anthropic", "ollama", "gemini"]),
  model: z.string().min(1),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1),
  apiKey: z.string().optional(),
  baseUrl: z.string().url().optional(),
});

export type AITaskConfig = z.infer<typeof AITaskConfigSchema>;

/**
 * Executes a prompt against multiple LLM providers dynamically.
 */
export const handleAIPrompt = async (config: AITaskConfig, context: Record<string, unknown>) => {
  const finalUserPrompt = resolveTemplate(config.userPrompt, context);
  const finalSystemPrompt = config.systemPrompt
    ? resolveTemplate(config.systemPrompt, context)
    : undefined;

  let modelInstance;

  if (config.provider === "openai") {
    if (!config.apiKey) throw new Error("OpenAI API Key is required in node configuration.");
    const openai = createOpenAI({
      apiKey: config.apiKey,
    });
    modelInstance = openai(config.model);
  } else if (config.provider === "anthropic") {
    if (!config.apiKey) throw new Error("Anthropic API Key is required in node configuration.");
    const anthropic = createAnthropic({
      apiKey: config.apiKey,
    });
    modelInstance = anthropic(config.model);
  } else if (config.provider === "gemini") {
    if (!config.apiKey) throw new Error("Google Gemini API Key is required in node configuration.");
    const google = createGoogleGenerativeAI({
      apiKey: config.apiKey,
    });
    modelInstance = google(config.model);
  } else if (config.provider === "ollama") {
    const ollama = createOpenAI({
      apiKey: "ollama",
      baseURL: config.baseUrl || CONSTANTS.OLLAMA_DEFAULT_BASE_URL,
    });
    modelInstance = ollama(config.model);
  } else {
    throw new Error(`Unsupported AI provider: ${config.provider}`);
  }

  try {
    const { text } = await generateText({
      model: modelInstance,
      system: finalSystemPrompt,
      prompt: finalUserPrompt,
    });

    return {
      text,
      success: true,
    };
  } catch (error: any) {
    console.error(
      `[AI Integration] Failed to execute ${config.provider}/${config.model}:`,
      error,
    );
    throw new Error(`AI execution failed: ${error.message || String(error)}`);
  }
};
