import { IndexedType } from "../../types";

// Export providers.
export { ProviderGroq } from "./groq";

export interface ModelProvider {
  name: string;
  model: string;
  apiKey: string | undefined;
  validModels: string[];
  rerank: (
    list: IndexedType[],
    idKey: keyof IndexedType,
    contentKey: keyof IndexedType,
    query: string
  ) => Promise<string[]>;
}
