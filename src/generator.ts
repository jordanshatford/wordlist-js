import * as fs from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';
import { processWordsFileContent, snakeToCamel } from './utils';

interface IGenerateOptions {
  sourceDir: string;
  outputDir: string;
  dialects: string[];
  frequencies: string[];
}

const templatePath = path.join(__dirname, '..', 'src', 'templates');
const wordsTemplate = fs.readFileSync(path.join(templatePath, 'words.mustache'), 'utf-8');
const indexTemplate = fs.readFileSync(path.join(templatePath, 'index.mustache'), 'utf-8');

export function generate(options: IGenerateOptions) {
  process.stdout.write('Generating words with options:\n');
  process.stdout.write('--------------------------------------------------\n');
  process.stdout.write(`${JSON.stringify(options, null, 2)}\n`);
  process.stdout.write('--------------------------------------------------\n');
  const { sourceDir, outputDir, dialects, frequencies } = options;
  const outputDirPath = path.join(__dirname, '..', outputDir);
  const sourceDirPath = path.join(__dirname, '..', sourceDir);

  fs.mkdir(outputDirPath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  process.stdout.write('Generating each dialects words...\n');
  dialects.forEach((dialect) => {
    process.stdout.write(`  ${dialect}... `);
    const dialectFrequencies: Array<{ name: string; words: string[] }> = [];
    frequencies.forEach((frequency) => {
      process.stdout.write(` ${frequency}..`);
      const scowlFileName = `${dialect}-words.${frequency}`;
      const scowlFileContent = fs.readFileSync(path.join(sourceDirPath, scowlFileName), 'latin1');
      dialectFrequencies.push({
        name: `${snakeToCamel(dialect)}${frequency}`,
        words: processWordsFileContent(scowlFileContent),
      });
    });
    process.stdout.write(' \u2713\n');
    const result = Mustache.render(wordsTemplate, {
      frequencies: dialectFrequencies,
      dialect: snakeToCamel(dialect),
    });
    const fileName = `${snakeToCamel(dialect)}.ts`;
    fs.writeFileSync(path.join(outputDirPath, fileName), result);
  });
  process.stdout.write('Generating dialects complete.\n');
  process.stdout.write('Generating index file...\n');
  // Generate index.ts file linking all subfiles
  const files = dialects.map((value) => snakeToCamel(value));
  const indexContent = Mustache.render(indexTemplate, { files: files });
  fs.writeFileSync(path.join(outputDirPath, 'index.ts'), indexContent);
  process.stdout.write('Generating complete.\n');
}
