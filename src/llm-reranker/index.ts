import Groq from "groq-sdk";
import { IndexedType } from "../types";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

// List of available models from Groq.
// https://console.groq.com/docs/models
const groqModels = [
  "llama3-8b-8192",
  "llama3-70b-8192",
  "mixtral-8x7b-32768",
  "gemma-7b-it",
];

/**
 * LLMReranker is a class that provides a reranking functionality using
 * a language model from various providers. The class currently supports
 * the Groq provider which hosts a variety of language models inc
 * the Llama and Mixtral models.
 *
 * ```typescript
 * import { LLMReranker } from "rerank";
 * const reranker = new LLMReranker("groq", "llama3-8b-8192", API_KEY);
 * const result = await reranker.rerank(rankedList, "id", "value", query);
 * ...
 * ```
 *
 * @param provider The provider of the language model.
 * @param model The language model to use for reranking.
 * @param apiKey The API key to access the language model.
 */
export class LLMReranker {
  constructor(
    public provider: "groq",
    public model: string,
    public apiKey: string
  ) {
    this.provider = provider;
    this.model = model;
    this.apiKey = apiKey;

    this.validateProviderModel();
  }

  /**
   * Reranks a list of text based on their relevance to the query.
   *
   * @param rankLists List of text to rerank.
   * @param idKey Key to use as the identifier.
   * @param contentKey Key to access the content to rerank.
   * @param query Search query to rerank the text against.
   *
   * @returns A list of identifiers in the order of relevance to the query.
   */
  public async rerank(
    rankLists: IndexedType[],
    idKey: keyof IndexedType,
    contentKey: keyof IndexedType,
    query: string
  ): Promise<string[]> {
    // When adding support for more providers, add a case statement here.
    switch (this.provider) {
      case "groq":
        return this.groqRerank(rankLists, idKey, contentKey, query);
    }
  }

  /**
   * Validates the provider and model combination supported by the class.
   */
  private validateProviderModel() {
    switch (this.provider) {
      case "groq":
        if (!groqModels.includes(this.model)) {
          this.throwModelError();
        }
        break;
      default:
        throw new Error(`Invalid provider "${this.provider}"`);
    }
  }

  private throwModelError() {
    const message = `Invalid model "${this.model}" for provider "${this.provider}"`;
    const availableModels = groqModels.join("\n");
    throw new Error(`${message}. Available models:\n${availableModels}`);
  }

  /**
   * Creates a completion request using the Groq SDK.
   * @param input Prompt to infer the completion.
   * @returns Text completion from the language model.
   */
  private async groqInfer(input: string): Promise<string> {
    const groq = new Groq({
      apiKey: this.apiKey,
    });

    const messages: ChatCompletionMessageParam[] = [
      { role: "user", content: input },
    ];

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: this.model,
    });

    return completion.choices[0]?.message?.content || "";
  }

  private async groqRerank(
    rankLists: IndexedType[],
    idKey: keyof IndexedType,
    contentKey: keyof IndexedType,
    query: string
  ): Promise<string[]> {
    const length = rankLists.length;

    let passages = "";
    rankLists.forEach((item, index) => {
      passages += `[${index + 1}] ${item[contentKey]}\n`;
    });

    let input = `
    I will provide you with ${length} passages, each indicated by
    a numerical identifier []. Rank the passages based on their relevance
    to the search query: ${query}.

    ${passages}

    Search Query: ${query}.

    Rank the ${length} passages above based on their relevance to the search query.
    All the passages should be included and listed using identifiers, in
    descending order of relevance.

    The output format should be [] > [], e.g., [4] > [2].
    Only respond with the ranking results, do not say any word or explain.
  `;

    // This trims the indentation when using the multiline string above.
    input = input.replace(/    +/g, "");

    const completion = await this.groqInfer(input);
    const ranks = this.parseResult(completion);

    const result: Array<string> = [];
    ranks.forEach((index) => {
      result.push(rankLists[index - 1][idKey]);
    });

    return result;
  }

  /**
   * Parses the completion result to extract the ranking.
   * @param result Completion result from the language model.
   * @returns A list of indices in the order of relevance.
   */
  private parseResult(result: string): Array<number> {
    const lines = result.split(">");
    const ranking: Array<number> = [];

    lines.forEach((line) => {
      const match = line.match(/\[(\d+)\]/g);
      if (match) {
        const index = parseInt(match[0].replace(/\[|\]/g, ""));
        ranking.push(index);
      }
    });

    return ranking;
  }
}
