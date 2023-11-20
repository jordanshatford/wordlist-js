import { generate } from './generator';
import config from '../wordlist.config.json';

generate({
  dialects: config.dialects,
  frequencies: config.frequencies,
  sourceDir: config.source,
  outputDir: config.output,
});
