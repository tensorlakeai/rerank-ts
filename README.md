# reranker-ts

`rerank-ts` is a lightweight TypeScript library for re-ranking search results from retreival systems. 

Adding Re-Ranking almost always improves accuracy of retrieval pipelines. If you are building a RAG application, and using semantic search or full-text search using this library to re-rank the results will improve accuracy of the application in most cases. However, re-ranking usually adds some amount of latency. We have added knobs in the LLM ReRanker to control latency. 

## Installation

Install `rerank` using npm:

```bash
npm install rerank
```

## Algorithms
- LLM Re-Rankers
- Reciprocal Rank Fusion

### LLM Re-Rankers

- [Permutation Generation with sliding windows](https://arxiv.org/pdf/2304.09542)

**Available Providers:**

- **Groq**: `ProviderGroq`
- **OpenAI**: `ProviderOpenAI`

> Model Providers are implemented with a clean interface, we welcome contributions to add support for other model providers from the community! 

**Example Usage:**

```typescript
import { LLMReranker, ProviderGroq } from "rerank";
const provider = new ProviderGroq("llama3-8b-8192", API_KEY);
const reranker = new LLMReranker(provider);

// Replace with your own list of objects to rerank.
const list = [
  { key: "bc8fe338", value: "I hate vegetables" },
  { key: "236386f2", value: "I love mangoes" },
];

const query = "I love apples";
const result = await reranker.rerank(list, "key", "value", query);
// ["236386f2", "bc8fe338"]
```

### Reciprocal RankFusion

Combine multiple rank lists by assigning scores based on reciprocal ranks, effectively prioritizing higher-ranked items across all lists.
[Paper](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf)

**Example Usage:**

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
