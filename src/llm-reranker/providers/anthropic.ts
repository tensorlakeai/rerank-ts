import Anthropic from "@anthropic-ai/sdk";
import { ModelProvider } from ".";

export class ProviderAnthropic implements ModelProvider {
  model: string;
  apiKey: string;

  name = "anthropic";
  validModels = ["claude-13b", "claude-7b", "claude-35t"];

  constructor(model: string, apiKey: string) {
    this.model = model;
    this.apiKey = apiKey;
  }

  private fixMessages(
    messages: Array<{ role: "assistant" | "user"; content: string }>
  ) {
    const fixed = [];
    for (const message of messages) {
      if (
        fixed.length > 0 &&
        fixed[fixed.length - 1].role === "user" &&
        message.role === "user"
      ) {
        fixed[fixed.length - 1].content += "\n" + message.content;
      } else {
        fixed.push(message);
      }
    }

    return fixed;
  }

  /**
   * Creates a completion request using the Anthropic SDK.
   * @param input Prompt to infer the completion.
   * @returns Text completion from the language model.
   */
  public async infer(input: string): Promise<string> {
    const anthropic = new Anthropic({
      apiKey: this.apiKey,
    });

    const messages = this.fixMessages([{ role: "user", content: input }]);

    const params: Anthropic.MessageCreateParams = {
      max_tokens: 1024,
      messages: messages,
      model: this.model,
    };

    const completion = await anthropic.messages.create(params);

    // TODO: Handle multiple completions
    return ''
  }
}
