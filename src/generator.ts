import * as fs from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';
import { processWordsFileContent } from './utils';

interface IGenerateOptions {
  sourceDir: string;
  outputDir: string;
  dialects: string[];
  frequencies: string[];
}

const projectDir = path.join(__dirname, '..');
const templatePath = path.join(projectDir, 'src', 'templates');
const wordsTemplate = fs.readFileSync(path.join(templatePath, 'words.mustache'), 'utf-8');
const indexTemplate = fs.readFileSync(path.join(templatePath, 'index.mustache'), 'utf-8');
const readmeTemplate = fs.readFileSync(path.join(templatePath, 'readme.mustache'), 'utf-8');

export function generate(options: IGenerateOptions) {
  process.stdout.write('Generating words with options:\n');
  process.stdout.write('--------------------------------------------------\n');
  process.stdout.write(`${JSON.stringify(options, null, 2)}\n`);
  process.stdout.write('--------------------------------------------------\n');
  const { sourceDir, outputDir, dialects, frequencies } = options;
  const outputDirPath = path.join(projectDir, outputDir);
  const sourceDirPath = path.join(projectDir, sourceDir);

  fs.mkdir(outputDirPath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const filteredWords = fs.readFileSync(path.join(sourceDirPath, 'filtered.json'), 'utf-8');
  const splitFilteredWords: string[] = JSON.parse(filteredWords);

  process.stdout.write('Generating each dialects words...\n');
  dialects.forEach((dialect) => {
    process.stdout.write(`  ${dialect}... `);
    const scowlFileName = `${dialect}.json`;
    const scowlFileContent = fs.readFileSync(path.join(sourceDirPath, scowlFileName), 'utf-8');
    const scowlJson: Record<string, string[]> = JSON.parse(scowlFileContent);
    const dialectFrequencies: Array<{ name: string; words: string[]; isNotBad: boolean }> = [];
    frequencies.forEach((frequency) => {
      process.stdout.write(` ${frequency}..`);
      const content = scowlJson[frequency];
      const [filteredWords, badwords] = processWordsFileContent(content, splitFilteredWords);
      dialectFrequencies.push({
        name: `${dialect}${frequency}`,
        words: filteredWords,
        isNotBad: true,
      });
      if (badwords.length > 0) {
        dialectFrequencies.push({
          name: `${dialect}Bad${frequency}`,
          words: badwords,
          isNotBad: false,
        });
      }
    });
    process.stdout.write(' \u2713\n');
    const result = Mustache.render(wordsTemplate, {
      frequencies: dialectFrequencies,
      dialect,
    });
    const fileName = `${dialect}.ts`;
    fs.writeFileSync(path.join(outputDirPath, fileName), result);
  });
  process.stdout.write('Generating dialects complete.\n');
  process.stdout.write('Generating index file...\n');
  // Generate index.ts file linking all subfiles
  const files = dialects.map((value) => value);
  const indexContent = Mustache.render(indexTemplate, { files: files });
  fs.writeFileSync(path.join(outputDirPath, 'index.ts'), indexContent);
  process.stdout.write('Generating README file...\n');
  // Generate README.md with list of wordslists
  const readmeData = dialects.map((dialect) => {
    return { name: dialect, frequencies };
  });
  const readmeContent = Mustache.render(readmeTemplate, { dialects: readmeData });
  fs.writeFileSync(path.join(projectDir, 'README.md'), readmeContent);
  process.stdout.write('Generating complete.\n');
}
