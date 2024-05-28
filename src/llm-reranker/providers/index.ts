import { IndexedType } from "../../types";

// Export providers.
export { ProviderGroq } from "./groq";

export interface ModelProvider {
  name: string;
  model: string;
  apiKey: string | undefined;
  validModels: string[];
  infer: (input: string) => Promise<string>;
}