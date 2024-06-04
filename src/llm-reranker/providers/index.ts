// Export providers.
import { ProviderAnthropic } from './anthropic';
export { ProviderGroq } from "./groq";
export { ProviderOpenAI } from "./openai";

export interface ModelProvider {
  name: string;
  model: string;
  apiKey?: string;
  validModels: string[];
  infer: (input: string) => Promise<string>;
}
