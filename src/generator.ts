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
  const { sourceDir, outputDir, dialects, frequencies } = options;
  const outputDirPath = path.join(__dirname, '..', outputDir);
  const sourceDirPath = path.join(__dirname, '..', sourceDir);

  fs.mkdir(outputDirPath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  dialects.forEach((dialect) => {
    const categories: any[] = [];
    frequencies.forEach((frequency) => {
      const scowlFileName = `${dialect}-words.${frequency}`;
      const scowlFileContent = fs.readFileSync(path.join(sourceDirPath, scowlFileName), 'latin1');
      categories.push({
        name: `${snakeToCamel(dialect)}${frequency}`,
        words: processWordsFileContent(scowlFileContent),
      });
    });
    const result = Mustache.render(wordsTemplate, { frequencies: categories });
    const fileName = `${snakeToCamel(dialect)}.ts`;
    fs.writeFileSync(path.join(outputDirPath, fileName), result);
  });

  // Generate index.ts file linking all subfiles
  const files = dialects.map((value) => snakeToCamel(value));
  const indexContent = Mustache.render(indexTemplate, { files: files });
  fs.writeFileSync(path.join(outputDirPath, 'index.ts'), indexContent);
}
