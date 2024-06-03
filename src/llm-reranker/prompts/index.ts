/**
 * Class to load and store prompt templates.
 *
 * For the prompt template to be used as the LLM input,
 * it must be evaluated as a string.
 *
 * ```ts
 * let prompt = new PromptTemplate(`${provider}-${model}`).prompt;
 * let input = eval("`" + prompt + "`");
 * ```
 *
 * @param name Name of the prompt file.
 */

import defaultPrompt from "./default";
import groqllama38b8192 from "./groq-llama3-8b-8192";
export class PromptTemplate {
  public prompt: string;

  constructor(public name: string) {
    this.prompt = this.getPrompt(name);
  }

  private getPrompt(name: string) {
    const prompts: Record<string, string> = {
      default: defaultPrompt,
      "groq-llama3-8b-8192": groqllama38b8192,
    };
    return prompts[name] || prompts["default"];
  }
}
