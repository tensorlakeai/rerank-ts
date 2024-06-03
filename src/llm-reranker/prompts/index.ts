import fs from "fs";
import * as path from "path";

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
    let file = path.join(__dirname, `${name}.txt`);

    if (!fs.existsSync(file)) {
      file = path.join(__dirname, "default.txt");
    }

    return fs.readFileSync(file, "utf-8");
  }
}
