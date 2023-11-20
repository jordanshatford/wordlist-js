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
      const wordExp = globRegex(word);
      return wordExp.test(string) || word === string;
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

const dotRE = /\./g;
const dotPattern = '\\.';

const restRE = /\*\*$/g;
const restPattern = '(.+)';

const globRE = /(?:\*\*\/|\*\*|\*)/g;
const globPatterns: Record<string, string> = {
  '*': '([^/]*)', // no backslashes
  '**': '(.+/)?([^/]+)', // short for "**/*"
  '**/': '(.+/)?', // one or more directories
};

function mapToPattern(str: string): string {
  return globPatterns[str];
}

function replace(glob: string): string {
  return glob.replace(dotRE, dotPattern).replace(restRE, restPattern).replace(globRE, mapToPattern);
}

// function join(globs: string[]) {
//   return '((' + globs.map(replace).join(')|(') + '))';
// }

function globRegex(glob: string) {
  return new RegExp('^' + replace(glob) + '$');
}
