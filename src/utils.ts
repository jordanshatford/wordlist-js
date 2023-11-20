const badWordPlaceHolderLetter = '*';

export function snakeToCamel(str: string): string {
  return str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
}

export function filterBadWords(words: string[], badWordsIN: string[]) {
  const badwords: string[] = [];
  const filteredWords = words.filter((w) => {
    const cleaned = clean(w, badWordsIN);
    const bad = cleaned.split('').every((l) => l === badWordPlaceHolderLetter);
    if (bad) {
      badwords.push(w);
    }
    return !bad;
  });
  return [filteredWords, badwords];
}

export function processWordsFileContent(content: string, badwordsIn: string[]) {
  const splitWordsList = content.trim().split('\r\n');
  const wordsWithoutPossesives = splitWordsList.filter((word) => {
    return !/'s$/.test(word);
  });
  const sortedFileWords = wordsWithoutPossesives.sort();
  const [filteredWords, badwords] = filterBadWords(sortedFileWords, badwordsIn);
  return [filteredWords, badwords];
}

function isProfane(string: string, badwordIN: string[]): boolean {
  return (
    badwordIN.filter((word) => {
      const wordExp = new RegExp(`\\b${word.replace(/(\W)/g, '\\$1')}\\b`, 'gi');
      return wordExp.test(string);
    }).length > 0 || false
  );
}

function replaceWord(string: string) {
  return string.replace(/[^a-zA-Z0-9|$|@]|\^/g, '').replace(/\w/g, badWordPlaceHolderLetter);
}

function clean(string: string, badwordIN: string[]): string {
  const splitRegex = /\b/;
  return string
    .split(splitRegex)
    .map((word) => {
      return isProfane(word, badwordIN) ? replaceWord(word) : word;
    })
    .join(splitRegex.exec(string)?.[0]);
}
