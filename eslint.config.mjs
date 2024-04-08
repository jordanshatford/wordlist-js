import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
  ignores: ['.DS_Store', 'node_modules/', '__generated__', 'dist/'],
});
