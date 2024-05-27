import Groq from "groq-sdk";
import { ModelProvider } from ".";
import { IndexedType } from "../../types";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

export class ProviderGroq implements ModelProvider {
  model: string;
  apiKey: string | undefined;

  name = "groq";

  // List of available models from Groq.
  // https://console.groq.com/docs/models
  validModels = [
    "llama3-8b-8192",
    "llama3-70b-8192",
    "mixtral-8x7b-32768",
    "gemma-7b-it",
  ];

  constructor(model: string, apiKey: string) {
    this.model = model;
    this.apiKey = apiKey;
  }

  public async rerank(
    list: IndexedType[],
    idKey: keyof IndexedType,
    contentKey: keyof IndexedType,
    query: string
  ): Promise<string[]> {
    const length = list.length;

    let passages = "";
    list.forEach((item, index) => {
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

    const completion = await this.infer(input);
    const ranks = this.parseResult(completion);

    const result: Array<string> = [];
    ranks.forEach((index) => {
      result.push(list[index - 1][idKey]);
    });

    return result;
  }

  /**
   * Creates a completion request using the Groq SDK.
   * @param input Prompt to infer the completion.
   * @returns Text completion from the language model.
   */
  private async infer(input: string): Promise<string> {
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
