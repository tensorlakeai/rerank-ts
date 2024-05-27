import fs from "fs";

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
export class PromptTemplate {
  public prompt: string;

  constructor(public name: string) {
    this.prompt = this.getPrompt(name);
  }

  private getPrompt(name: string) {
    let file = `src/llm-reranker/prompts/${name}.txt`;

    if (!fs.existsSync(file)) {
      console.error(`Prompt file "${file}" not found. Using default prompt.`);
      file = "src/llm-reranker/prompts/default.txt";
    }

    return fs.readFileSync(file, "utf-8");
  }
}
