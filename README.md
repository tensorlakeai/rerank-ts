# rerank

`rerank` is a lightweight TypeScript library designed for easy re-ranking supporting multiple use cases. `rerank` currently supports single rank list re-ranking and rank list aggregation using Reciprocal Rank Fusion (RRF).

`rerank` allows rank list aggregation by combining multiple ranked lists into a single, improved rank list using various rank aggregation techniques. For this use case, `rerank` supports the Reciprocal Rank Fusion (RRF) method, renowned for its effectiveness in information retrieval and ensemble learning contexts.

`rerank` also supports re-ranking a single rank list by using LLM as a re-ranking agent. This is useful when you have a single rank list and want to improve the ranking semantically based on the content of the list and user query.

## Features

- **Reciprocal Rank Fusion (RRF)**: Combine multiple rank lists by assigning scores based on reciprocal ranks, effectively prioritizing higher-ranked items across all lists.
- **LLM Reranker**: Re-rank a single rank list using a Language Model (LLM) to improve the ranking for the list semantically.

## Installation

Install `rerank` using npm:

```bash
npm install rerank
```

## Example Usage

```typescript
import { reciprocalRankFusion } from "rerank";

interface ImageSearchResult {
  url: string;
  width: string;
  height: string;
  score: number;
}

// assume you are searching 3 different queries
const rankedLists: ImageSearchResult[][] = await Promise.all([
  searchIndex("imageEmbeddingIndex", "person riding skateboard"),
  searchIndex("imageEmbeddingIndex", "person skating on the sidewalk"),
  searchIndex("imageIndex", "skateboard trick"),
]);

// perform reciprocal rank fusion on all of the results and specify key id, in this case "url"
// this will return a map of all urls now ranked with rrf score
const rankedURLs = reciprocalRankFusion(rankedLists, "url");

// build map of results keyed by url
const resultsMap = new Map<string, ImageSearchResult>();
rankedLists.flat().forEach((result) => {
  resultsMap.set(result.url, result);
});

// get single sorted results list from rrf
const sortedResults = Array.from(rankedUrls.keys()).map((url) => {
  return resultsMap.get(url);
});
```
