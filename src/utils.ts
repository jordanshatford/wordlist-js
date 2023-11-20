export function filterBadWords(words: string[], badWordsIN: string[]) {
  const badwords: string[] = [];
  const filteredWords = words.filter((w) => {
    const bad = isProfane(w, badWordsIN);
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
