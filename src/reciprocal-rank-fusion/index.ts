import { IndexedType, RankedList } from "../types";

export function reciprocalRankFusion<T extends IndexedType>(
  rankLists: RankedList<T>[],
  idKey: keyof T
): Map<string, number> {
  const c = 60;
  const scores: Map<string, number> = new Map();

  // Calculate scores for each item across all lists
  for (let i = 0; i < rankLists.length; i++) {
    const list = rankLists[i];
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      const itemId = item[idKey] as string; // Cast once and reuse
      const rrfScore = 1 / (c + index + 1); // Compute RRF score
      const currentScore = scores.get(itemId) || 0; // Get current score, default to 0
      scores.set(itemId, currentScore + rrfScore); // Update score
    }
  }

  const sortedScoresArray = Array.from(scores).sort((a, b) => b[1] - a[1]);
  const sortedScores = new Map(sortedScoresArray);
  return sortedScores;
}
