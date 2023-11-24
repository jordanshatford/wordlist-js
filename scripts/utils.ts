/**
 * Process a list of words. Filter out specific words.
 * @param words - the list of words.
 * @param toFilter - the words to filter out.
 * @returns = object containing list of filtered and filtered out words.
 */
export function processWordsList(
  words: string[],
  toFilter: string[]
): { filtered: string[]; filteredOut: string[] } {
  // Sort list of words.
  const sortedWords = words.sort();
  // Track all words filtered out.
  const filteredOut: string[] = [];
  const filteredWords = sortedWords.filter((word) => {
    const shouldFilter = toFilter.some((w) => w.toLowerCase() === word.toLowerCase());
    if (shouldFilter) {
      filteredOut.push(word);
    }
    return !shouldFilter;
  });
  return { filtered: filteredWords, filteredOut };
}

export default {
  processWordsList,
};
