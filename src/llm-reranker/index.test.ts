import { LLMReranker, ModelProvider, ProviderGroq, ProviderOpenAI } from ".";
import "dotenv/config";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Conditional check for required environment variables.
if (GROQ_API_KEY === undefined || OPENAI_API_KEY === undefined) {
  throw new Error("Required environment variables are not set!");
}

// Mock data for testing.
const QUERY = "I love apples";
const LIST = [
  { id: "a", value: "My name is Edwin" },
  { id: "b", value: "My favorite food is cheeseburgers" },
  { id: "c", value: "I love apple" },
  { id: "d", value: "There is a frog in the well" },
];

async function testRerank(provider: ModelProvider): Promise<string[]> {
  const reranker = new LLMReranker(provider, { windowSize: 2, step: 1 });
  const { result, usage } = await reranker.rerank(LIST, "id", "value", QUERY);
  console.log(usage);
  expect(result.length).toBe(LIST.length);
  expect(result[0]).toBe("c");
  return result;
}

test("test groq ranker", async () => {
  const provider = new ProviderGroq("llama3-8b-8192", GROQ_API_KEY);
  await testRerank(provider);
});

test("test openai ranker", async () => {
  const provider = new ProviderOpenAI("gpt-4", OPENAI_API_KEY);
  await testRerank(provider);
});
