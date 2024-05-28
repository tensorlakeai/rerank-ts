import { LLMReranker, ProviderGroq } from ".";

// Substitute with your own API key.
const API_KEY = "xxx";

test("test groq ranker", async () => {
  const provider = new ProviderGroq("llama3-8b-8192", API_KEY);
  const reranker = new LLMReranker(provider, { windowSize: 2, step: 1 });

  const rankedList = [
    { id: "a", value: "My name is Edwin" },
    { id: "b", value: "My favorite food is cheeseburgers" },
    { id: "c", value: "I love apple" },
    { id: "d", value: "There is a frog in the well" },
  ];

  const query = "I love apples";
  const result = await reranker.rerank(rankedList, "id", "value", query);
  expect(result[0]).toBe("a");
});
