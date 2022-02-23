import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';
import * as Mustache from 'mustache';
import { processWordsFileContent, snakeToCamel } from './utils';

const args = yargs
  .options('source', {
    alias: 's',
    default: 'src/assets/',
    type: 'string',
    description: 'path to folder containing scowl final sources',
  })
  .option('output', {
    alias: 'o',
    default: 'generated/',
    type: 'string',
    description: 'directory to output typescript file to',
  })
  .options('nationalities', {
    alias: 'n',
    default: [] as string[],
    type: 'string',
    array: true,
  })
  .options('frequencies', {
    alias: 'f',
    default: [] as string[],
    type: 'string',
    array: true,
  }).argv;

// @ts-ignore
const nationalities: string[] = args.nationalities;

// @ts-ignore
const frequencies: string[] = args.frequencies;

// @ts-ignore
const sourceDir: string = args.source;
// @ts-ignore
const outDir: string = args.output;

fs.mkdir(outDir, { recursive: true }, (err) => {
  if (err) throw err;
});

function getWordlist(name: string, subCategory: string, frequency: string) {
  const fileName = `${name}-${subCategory}.${frequency}`;
  const filePath = path.join(__dirname, '..', sourceDir, fileName);
  const fileEncoding = 'latin1';
  return processWordsFileContent(fs.readFileSync(filePath, fileEncoding));
}

const templatePath = path.join(__dirname, '..', 'src', 'templates', 'words.mustache');
const template = fs.readFileSync(templatePath, 'utf-8');

nationalities.forEach(function (nationality) {
  const categories: any[] = [];
  frequencies.forEach(function (frequency) {
    categories.push({
      name: `${snakeToCamel(nationality)}${frequency}`,
      words: getWordlist(nationality, 'words', frequency),
    });
  });
  const result = Mustache.render(template, { frequencies: categories });
  const filePath = path.join(__dirname, '..', outDir, snakeToCamel(nationality) + '.ts');
  fs.writeFileSync(filePath, result);
});

// Generate index.ts file linking all subfiles
const files = nationalities.map((value) => snakeToCamel(value));
const templatePath2 = path.join(__dirname, '..', 'src', 'templates', 'index.mustache');
const template2 = fs.readFileSync(templatePath2, 'utf-8');
const result2 = Mustache.render(template2, { files: files });
const filePath2 = path.join(__dirname, '..', outDir, 'index.ts');
fs.writeFileSync(filePath2, result2);
