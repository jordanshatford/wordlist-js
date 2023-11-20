const badWordPlaceHolderLetter = '*';

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

export function processWordsFileContent(content: string[], badwordsIn: string[]) {
  const wordsWithoutPossesives = content.filter((word) => {
    return !/'s$/.test(word);
  });
  const sortedFileWords = wordsWithoutPossesives.sort();
  const [filteredWords, badwords] = filterBadWords(sortedFileWords, badwordsIn);
  return [filteredWords, badwords];
}

function isProfane(string: string, badwordIN: string[]): boolean {
  return badwordIN.some((w) => w.toLowerCase() === string.toLowerCase());
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
