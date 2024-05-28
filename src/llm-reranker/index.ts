import { IndexedType } from "../types";
import { ModelProvider } from "./providers";
import { PromptTemplate } from "./prompts";

export * from "./providers";

interface RankerParams {
  windowSize: number;
  step: number;
}

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
 * @param params Optional parameters for the reranker sliding window algorithm.
 */
export class LLMReranker {
  constructor(public provider: ModelProvider, public params?: RankerParams) {
    this.provider = provider;
    this.params = params;
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
    let passages: string[] = [];
    list.forEach((item, index) => {
      passages.push(`[${index + 1}] ${item[contentKey]}`);
    });

    const windowSize = this.params?.windowSize || 10;
    const step = this.params?.step || 5;

    const length = list.length;
    let start = length - windowSize > 0 ? length - windowSize : 0;

    while (start >= 0) {
      const batch = passages.slice(start, start + windowSize);
      const rank = await this.rankBatch(query, batch);

      // Restructure passages based on the ranking.
      for (let i = 0; i < rank.length; i++) {
        const index = start + i;
        passages[index] = rank[i];
      }

      // If the start is 0, the entire list has been processed and we can break.
      if (start === 0) {
        break;
      }

      // Move the window to the left but not beyond the start point.
      start = start - step > 0 ? start - step : 0;
    }

    let result: string[] = [];
    passages.forEach((item) => {
      const match = item.match(/\[(\d+)\]/g);
      if (match) {
        const index = parseInt(match[0].replace(/\[|\]/g, ""));
        result.push(list[index - 1][idKey]);
      }
    });

    return result;
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

  private async rankBatch(query: string, batch: string[]): Promise<string[]> {
    let provider = this.provider.name;
    let modelName = this.provider.model;

    // Params required for the prompt. Don't change the name or remove them.
    let passages = batch.join("\n");
    let length = batch.length;

    let prompt = new PromptTemplate(`${provider}-${modelName}`).prompt;
    let input = eval("`" + prompt + "`");

    const completion = await this.provider.infer(input);
    const ranks = completion.split(">").map((item) => item.trim());

    let result: Array<string> = [];
    ranks.forEach((rank) => {
      let match = batch.filter((item) => item.startsWith(rank));
      if (match.length > 0) {
        result.push(match[0]);
      }
    });

    return result;
  }
}
