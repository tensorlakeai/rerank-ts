import Groq from "groq-sdk";
import { ModelProvider } from ".";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

export class ProviderGroq implements ModelProvider {
  model: string;
  apiKey?: string;

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

  /**
   * Creates a completion request using the Groq SDK.
   * @param input Prompt to infer the completion.
   * @returns Text completion from the language model.
   */
  public async infer(input: string): Promise<string> {
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
}
