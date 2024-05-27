import { IndexedType } from "../types";
import { ModelProvider } from "./providers";

export * from "./providers";

/**
 * LLMReranker is a class that provides a reranking functionality using
 * a language model from various LLM providers like Groq.
 *
 * ```typescript
 * import { LLMReranker, ProviderGroq } from "rerank";
 * const provider = new ProviderGroq("llama3-8b-8192", API_KEY);
 * const reranker = new LLMReranker(provider);
 * ...
 * ```
 *
 * @param provider The provider of the language model.
 */
export class LLMReranker {
  constructor(public provider: ModelProvider) {
    this.provider = provider;
    this.validateProviderModel();
  }

  /**
   * Reranks a list of text based on their relevance to the query.
   *
   * @param list List of text to rerank.
   * @param idKey Key to use as the identifier.
   * @param contentKey Key to access the content to rerank.
   * @param query Search query to rerank the text against.
   *
   * @returns A list of identifiers in the order of relevance to the query.
   */
  public async rerank(
    list: IndexedType[],
    idKey: keyof IndexedType,
    contentKey: keyof IndexedType,
    query: string
  ): Promise<string[]> {
    return this.provider.rerank(list, idKey, contentKey, query);
  }

  /**
   * Lists the valid models supported by the provider.
   */
  public listModels(): string[] {
    return this.provider.validModels;
  }

  /**
   * Validates the provider and model combination supported by the class.
   */
  private validateProviderModel() {
    const model = this.provider.model;
    const validModels = this.provider.validModels;

    if (!validModels.includes(model)) {
      const message = `Invalid model "${model}" for provider "${this.provider.name}"`;
      const availableModels = validModels.join("\n");
      throw new Error(`${message}. Valid models:\n${availableModels}`);
    }
  }
}
