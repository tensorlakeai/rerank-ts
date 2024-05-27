import fs from "fs";

export function getPrompt(name: string) {
  let file = `src/llm-reranker/prompts/${name}.txt`;

  if (!fs.existsSync(file)) {
    console.error(`Prompt file "${file}" not found. Using default prompt.`);
    file = "src/llm-reranker/prompts/default.txt";
  }

  return fs.readFileSync(file, "utf-8");
}
