import fs from 'fs';
import path from 'path';
import config from '../wordlist.config.json';

const projectDir = path.join(__dirname, '..');
const generatedDir = path.join(projectDir, config.output);
const distDir = path.join(projectDir, 'dist/');

fs.rmSync(generatedDir, { recursive: true, force: true });
fs.rmSync(distDir, { recursive: true, force: true });
