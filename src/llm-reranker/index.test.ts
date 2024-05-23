import { groqLLMRerank } from ".";

// Substitute with your own API key.
const API_KEY = "xxx";

test("test ranks", async () => {
  const rankedList = [
    { id: "a", value: "I love apple" },
    { id: "b", value: "My name is Edwin" },
    { id: "c", value: "My favorite food is cheeseburgers" },
    { id: "d", value: "There is a frog in the well" },
  ];

  const query = "I love apples";
  const result = await groqLLMRerank(rankedList, "id", "value", query, API_KEY);
  expect(result[0]).toBe("a");
});
