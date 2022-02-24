// @ts-nocheck
import * as yargs from 'yargs';
import { generate } from './generator';

const args = yargs
  .options('source', {
    alias: 's',
    default: 'src/assets/',
    type: 'string',
    description: 'path to directory which contains file from scowl final',
  })
  .option('output', {
    alias: 'o',
    default: 'src/generated/',
    type: 'string',
    description: 'path to directory to output generated typescript files to',
  })
  .options('dialects', {
    alias: 'd',
    default: ['english', 'american', 'australian', 'british', 'canadian', 'british_z'],
    type: 'string',
    array: true,
    description:
      'dialects to include when generating (english, american, australian, british, canadian, british_z)',
  })
  .options('frequencies', {
    alias: 'f',
    default: ['10', '20', '35', '40', '50', '55', '60'],
    type: 'string',
    array: true,
    description: 'frequencies to include when generating (10, 20, 35, 40, 50, 55, 60, 70, 80, 95)',
  }).argv;

const dialects: string[] = args.dialects;
const frequencies: string[] = args.frequencies;
const sourceDir: string = args.source;
const outputDir: string = args.output;

generate({ dialects, frequencies, sourceDir, outputDir });
