import OpenAI from "openai";
import { ModelProvider, ModelUsage } from ".";
import { performance } from "perf_hooks";

export class ProviderOpenAI implements ModelProvider {
  model: string;
  apiKey: string;

  name = "openai";
  validModels = ["gpt-4o", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"];

  constructor(model: string, apiKey: string) {
    this.model = model;
    this.apiKey = apiKey;
  }

  /**
   * Creates a completion request using the Groq SDK.
   * @param input Prompt to infer the completion.
   * @returns Text completion from the language model.
   */
  public async infer(
    input: string
  ): Promise<{ output: string; usage: ModelUsage }> {
    const openai = new OpenAI({ apiKey: this.apiKey });

    const startTime = performance.now();
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: input }],
      model: this.model,
    });
    const completionTime = performance.now() - startTime;

    return {
      output: completion.choices[0]?.message?.content || "",
      usage: {
        completionTokens: completion.usage?.completion_tokens,
        promptTokens: completion.usage?.prompt_tokens,
        completionTime,
      },
    };
  }
}
