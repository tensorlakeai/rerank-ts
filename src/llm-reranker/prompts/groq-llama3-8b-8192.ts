export default `I will provide you with \${length} passages, each indicated by
a numerical identifier []. Rank the passages based on their relevance
to the search query: \${query}.

\${passages}

Search Query: \${query}.

Rank the \${length} passages above based on their relevance to the search query.
All the passages should be included and listed using identifiers, in
descending order of relevance.

The output format should be [] > [], e.g., [4] > [2].
Only respond with the ranking results, do not say any word or explain.`;
