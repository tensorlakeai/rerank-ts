import { reciprocalRankFusion } from "./reciprocalRankFusion";

test("test ranks", async () => {
  const rankedList = [
    [
      { id: "a", value: 1 },
      { id: "b", value: 2 },
    ],
    [
      { id: "b", value: 1 },
      { id: "c", value: 2 },
    ],
  ];
  const result = reciprocalRankFusion(rankedList, "id");
  expect(Array.from(result.keys())).toEqual(["b", "a", "c"]);
});
