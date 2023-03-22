import Filter from 'bad-words';

export function snakeToCamel(str: string): string {
  return str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
}

export function filterBadWords(words: string[]) {
  const badWordPlaceHolderLetter = '*';
  const filter = new Filter({ placeHolder: badWordPlaceHolderLetter });
  const filteredWords = words.filter((w) => {
    const cleaned = filter.clean(w);
    const bad = cleaned.split('').every((l) => l === badWordPlaceHolderLetter);
    return !bad;
  });
  return filteredWords;
}

export function processWordsFileContent(content: string) {
  const splitWordsList = content.trim().split('\r\n');
  const wordsWithoutPossesives = splitWordsList.filter((word) => {
    return !/'s$/.test(word);
  });
  const sortedFileWords = wordsWithoutPossesives.sort();
  const filteredWords = filterBadWords(sortedFileWords);
  return filteredWords;
}
