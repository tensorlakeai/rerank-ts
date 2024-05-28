# Contributing to LLM Reranker

`LLMReranker` is a class that can be used to rerank a list of candidate sentences based on a given context by an LLM model. The class takes a `ModelProvider` object as input, which is an interface that provides some datapoint and methods to rerank the candidates.

## Adding a new provider

When adding a new provider, you need to implement the `ModelProvider` interface for the new provider class. For more information about the `ModelProvider` interface, please refer to the [ModelProvider](./providers/index.ts) interface.

## Prompts

Prompt plays a big part in the reranking process using LLM. For that, we have created an easy file-based prompt system with plain text.

If the new provider and its model require a different prompt than the default one, you can create a new prompt file in the `prompts` directory. The prompt file should be named as the provider name with the model name. For example, if the provider name is `new_provider` and the model name is `new_model`, the prompt file should be named:

```text
new-provider-new-model.txt
```

We can write the prompt in the file in plain text with format that is similar to template literals in JavaScript. For example:

```text
Search query: ${query}

Rank the following sentences in order of relevance to the search query:
${passages}
```

The prompt file can contain placeholders that will be replaced by the actual values when the prompt is used. The placeholders should be wrapped in `${}`. The available placeholders are:

- `${query}`: The search query.
- `${length}`: The number of candidate sentences.
- `${passages}`: The list of candidate sentences. Format:

  ```txt
  [1] Sentence 1
  [2] Sentence 2
  [3] Sentence 3
  ```
