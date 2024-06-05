// Export providers.
export { ProviderGroq } from "./groq";
export { ProviderOpenAI } from "./openai";

export interface ModelUsage {
  completionTime?: number;
  promptTokens?: number;
  completionTokens?: number;
}

export interface ModelProvider {
  name: string;
  model: string;
  apiKey?: string;
  validModels: string[];
  infer: (input: string) => Promise<{ output: string; usage: ModelUsage }>;
}
