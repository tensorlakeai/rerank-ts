import Groq from "groq-sdk";
import { IndexedType } from "../types";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

type modelID =
  | "llama3-8b-8192"
  | "llama3-70b-8192"
  | "mixtral-8x7b-32768"
  | "gemma-7b-it";

export async function groqLLMRerank(
  rankLists: IndexedType[],
  idKey: keyof IndexedType,
  contentKey: keyof IndexedType,
  query: string,
  apiKey: string,
  model: modelID = "llama3-8b-8192"
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

  const completion = await infer(apiKey, model, input);
  const ranks = parseResult(completion);

  const result: Array<string> = [];
  ranks.forEach((index) => {
    result.push(rankLists[index - 1][idKey]);
  });

  return result;
}

async function infer(
  apiKey: string,
  model: string,
  input: string
): Promise<string> {
  const groq = new Groq({
    apiKey: apiKey,
  });

  const messages: ChatCompletionMessageParam[] = [
    { role: "user", content: input },
  ];

  const completion = await groq.chat.completions.create({
    messages: messages,
    model: model,
  });

  return completion.choices[0]?.message?.content || "";
}

function parseResult(result: string): Array<number> {
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
