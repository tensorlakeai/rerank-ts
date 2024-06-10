# Reciprocal RankFusion

`reciprocalRankFusion` is a function that combines multiple ranked lists by assigning scores based on reciprocal ranks, effectively prioritizing higher-ranked items across all lists. This function is useful for aggregating search results or any ranked items from multiple sources.

[Paper](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf)

## Adding a New Ranked List

When adding a new ranked list, ensure that the list follows the `RankedList` type. The `RankedList` type is an array of items that conform to the `IndexedType` interface. For more information about these types, please refer to the [types](../types.ts) module.

## Usage Example

Below is an example of how to use the `reciprocalRankFusion` function in a TypeScript project:

```typescript
import { reciprocalRankFusion } from "rerank";

// Example structure of a search result for this usage example
interface SearchResult {
  url: string; // we will use this as our key identifier
  name: string;
}

// Assume you are searching with 3 different queries and fetching results
// searchIndex is just for demonstration purposes and should be replaced with your actual search implementation
const rankedLists: SearchResult[][] = await Promise.all([
  searchIndex("exampleIndex1", "person riding skateboard"),
  searchIndex("exampleIndex2", "person skating on the sidewalk"),
  searchIndex("exampleIndex3", "skateboard trick"),
]);

// Perform Reciprocal Rank Fusion (RRF) on all of the results
// The RRF function takes the ranked lists and a key identifier, in this case "url"
// It returns a map of all URLs now ranked with an RRF score
const rankedURLs = reciprocalRankFusion(rankedLists, "url");

// Build a map of results keyed by URL for easy access
const resultsMap = new Map<string, SearchResult>();
rankedLists.flat().forEach((result) => {
  resultsMap.set(result.url, result);
});

// Get a single sorted list of results based on the RRF ranking
const sortedResults = Array.from(rankedURLs.keys()).map((url) => {
  return resultsMap.get(url);
});
```