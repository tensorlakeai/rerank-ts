import { LLMReranker } from ".";

// Substitute with your own API key.
const API_KEY = "xxx";

test("test ranks", async () => {
  const reranker = new LLMReranker("groq", "llama3-8b-8192", API_KEY);

  const rankedList = [
    { id: "a", value: "I love apple" },
    { id: "b", value: "My name is Edwin" },
    { id: "c", value: "My favorite food is cheeseburgers" },
    { id: "d", value: "There is a frog in the well" },
  ];

  const query = "I love apples";
  const result = await reranker.rerank(rankedList, "id", "value", query);
  expect(result[0]).toBe("a");
});
