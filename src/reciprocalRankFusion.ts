export type RankedList<T> = T[];

type IndexedType = { [key: string]: any };

export function reciprocalRankFusion<T extends IndexedType>(
  rankLists: RankedList<T>[],
  idKey: keyof T
): Map<string, number> {
  const c = 60;
  const scores: Map<string, number> = new Map();

  // Calculate scores for each item across all lists
  rankLists.forEach((list) => {
    list.forEach((item, index) => {
      const rrfScore = 1 / (c + index + 1); // index is zero-based, add 1 for correct rank
      const currentScore = scores.get(item[idKey] as string) || 0;
      scores.set(item[idKey] as string, currentScore + rrfScore);
    });
  });

  const sortedScoresArray = Array.from(scores).sort((a, b) => b[1] - a[1]);
  const sortedScores = new Map(sortedScoresArray);
  return sortedScores;
}