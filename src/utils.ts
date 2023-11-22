/**
 * Filter words from a list and return two lists one of filtered words and one of words filtered out.
 * @param words - the list of words.
 * @param filtered - the list of words to filter.
 * @returns [FilteredWords, WordsRemoved]
 */
export function filterWords(words: string[], toFilter: string[]): string[][] {
  const filteredOut: string[] = [];
  const filteredWords = words.filter((word) => {
    const shouldFilter = toFilter.some((w) => w.toLowerCase() === word.toLowerCase());
    if (shouldFilter) {
      filteredOut.push(word);
    }
    return !shouldFilter;
  });
  return [filteredWords, filteredOut];
}

/**
 * Process a list of words.
 * @param words - the list of words.
 * @param toFilter - the words to filter out.
 * @returns [FilteredWords, WordsRemoved]
 */
export function processWordsList(words: string[], toFilter: string[]): string[][] {
  const sortedWords = words.sort();
  return filterWords(sortedWords, toFilter);
}
