export function snakeToCamel(str: string): string {
  return str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
}

export function processWordsFileContent(content: string) {
  const splitWordsList = content.trim().split('\r\n');
  const wordsWithoutPossesives = splitWordsList.filter((word) => {
    return !/'s$/.test(word);
  })
  return wordsWithoutPossesives.sort();
}
