import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import config from '../wordlist.config.json';

const ALLOWED_DIALECTS = ['english', 'american', 'australian', 'british', 'canadian', 'britishZ'];
const ALLOWED_FREQUENCIES = [10, 20, 35, 40, 50, 55, 60, 70, 80, 95];

const FILTERED_SUFFIX = '';
const FILTERED_OUT_SUFFIX = 'FilteredOut';
const UNFILTERED_SUFFIX = 'Unfiltered';

const projectDir = path.join(__dirname, '..');

/**
 * Process a list of words. Filter out specific words.
 * @param words - the list of words.
 * @param toFilter - the words to filter out.
 * @returns = object containing list of filtered and filtered out words.
 */
export function processWordsList(
  words: string[],
  toFilter: string[]
): { filtered: string[]; filteredOut: string[] } {
  // Sort list of words.
  const sortedWords = words.sort();
  // Track all words filtered out.
  const filteredOut: string[] = [];
  const filteredWords = sortedWords.filter((word) => {
    const shouldFilter = toFilter.some((w) => w.toLowerCase() === word.toLowerCase());
    if (shouldFilter) {
      filteredOut.push(word);
    }
    return !shouldFilter;
  });
  return { filtered: filteredWords, filteredOut };
}

export function generate() {
  process.stdout.write('Generating words with options:\n');
  process.stdout.write('--------------------------------------------------\n');
  process.stdout.write(`${JSON.stringify(config, null, 2)}\n`);
  process.stdout.write('--------------------------------------------------\n');
  const outputDirPath = path.join(projectDir, config.output);
  const sourceDirPath = path.join(projectDir, config.source);

  fs.mkdir(outputDirPath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const filteredWords = fs.readFileSync(path.join(sourceDirPath, '_filtered.json'), 'utf-8');
  const splitFilteredWords: string[] = JSON.parse(filteredWords);

  process.stdout.write('Generating each dialects words...\n');
  config.dialects.forEach((dialect) => {
    if (!ALLOWED_DIALECTS.includes(dialect)) {
      return;
    }
    process.stdout.write(`  ${dialect}... `);
    const filename = `${dialect}.json`;
    const fileContent = fs.readFileSync(path.join(sourceDirPath, filename), 'utf-8');
    const fileJSON: Record<string, string[]> = JSON.parse(fileContent);
    const dialectFrequencies: Array<{ name: string; filtered: string[]; filteredOut: string[] }> =
      [];
    config.frequencies.forEach((frequency) => {
      if (!ALLOWED_FREQUENCIES.includes(frequency)) {
        return;
      }
      process.stdout.write(` ${frequency}..`);
      const words = fileJSON[frequency];
      const { filtered, filteredOut } = processWordsList(words, splitFilteredWords);
      dialectFrequencies.push({
        name: `${dialect}${frequency}`,
        filtered,
        filteredOut,
      });
    });
    process.stdout.write(' \u2713\n');
    createDialectFile(dialect, dialectFrequencies, outputDirPath);
  });
  process.stdout.write('Generating dialects complete.\n');
  process.stdout.write('Generating index file...\n');
  // Generate index.ts file linking all subfiles
  createIndexFile(config.dialects, outputDirPath);
  process.stdout.write('Generating complete.\n');
}

/**
 * Create file for a specific dialect.
 * @param dialect - the dialect.
 * @param frequencies - the frequencies for that dialect.
 * @param outDir - the directory to output the file to.
 */
function createDialectFile(
  dialect: string,
  frequencies: { name: string; filtered: string[]; filteredOut: string[] }[],
  outDir: string
) {
  const statementArray: ts.Statement[] = [];
  // Add array for each frequency.
  for (const f of frequencies) {
    const frequencyArray = createExportedConstStringArray(
      `${f.name}${FILTERED_SUFFIX}`,
      f.filtered.map((w) => ts.factory.createStringLiteral(w))
    );
    statementArray.push(frequencyArray);
    const unfilteredItems = [`${f.name}${FILTERED_SUFFIX}`];
    if (f.filteredOut.length > 0) {
      const frequencyArrayFilteredOut = createExportedConstStringArray(
        `${f.name}${FILTERED_OUT_SUFFIX}`,
        f.filteredOut.map((w) => ts.factory.createStringLiteral(w))
      );
      statementArray.push(frequencyArrayFilteredOut);
      unfilteredItems.push(`${f.name}${FILTERED_OUT_SUFFIX}`);
    }
    const dialectUnfiltered = createExportedConstStringArray(
      `${f.name}${UNFILTERED_SUFFIX}`,
      unfilteredItems.map((i) => ts.factory.createSpreadElement(ts.factory.createIdentifier(i)))
    );
    statementArray.push(dialectUnfiltered);
  }
  // Add array for all (filtered words) of the dialect.
  const all = createExportedConstStringArray(
    `${dialect}All${FILTERED_SUFFIX}`,
    frequencies
      .filter((f) => f.filtered.length > 0)
      .map((f) => ts.factory.createSpreadElement(ts.factory.createIdentifier(f.name)))
  );
  statementArray.push(all);
  // List of all filtered out words
  const allFilteredOut = createExportedConstStringArray(
    `${dialect}All${FILTERED_OUT_SUFFIX}`,
    frequencies
      .filter((f) => f.filteredOut.length > 0)
      .map((f) =>
        ts.factory.createSpreadElement(
          ts.factory.createIdentifier(`${f.name}${FILTERED_OUT_SUFFIX}`)
        )
      )
  );
  statementArray.push(allFilteredOut);
  // List of all words Unfiltered
  const allNotFiltered = createExportedConstStringArray(`${dialect}All${UNFILTERED_SUFFIX}`, [
    ts.factory.createSpreadElement(ts.factory.createIdentifier(`${dialect}All${FILTERED_SUFFIX}`)),
    ts.factory.createSpreadElement(
      ts.factory.createIdentifier(`${dialect}All${FILTERED_OUT_SUFFIX}`)
    ),
  ]);
  statementArray.push(allNotFiltered);
  createTypeScriptFile(outDir, `${dialect}.ts`, statementArray);
}

/**
 * Create an exported const array with provided name and elements.
 * @param name - name of the export.
 * @param elements - elements in the export.
 * @returns ts.VariableStatement - the variable statement for the array.
 */
function createExportedConstStringArray(
  name: string,
  elements: ts.Expression[]
): ts.VariableStatement {
  return ts.factory.createVariableStatement(
    ts.factory.createModifiersFromModifierFlags(ts.ModifierFlags.Export),
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          name,
          undefined,
          ts.factory.createArrayTypeNode(
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
          ),
          ts.factory.createArrayLiteralExpression(elements)
        ),
      ],
      ts.NodeFlags.Const
    )
  );
}

/**
 * Create the index file used in the dist.
 * @param files - list of files to include.
 * @param outDir - the directory to output the file to.
 */
function createIndexFile(files: string[], outDir: string) {
  const statementArray: ts.Statement[] = [];
  for (const f of files) {
    const moduleSpec = ts.factory.createStringLiteral(`./${f}`);
    // Add import declaration.
    const importDeclaration = ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamespaceImport(ts.factory.createIdentifier(f))
      ),
      moduleSpec
    );
    statementArray.push(importDeclaration);
    // Export declaration.
    const exportDeclaration = ts.factory.createExportDeclaration(
      undefined,
      false,
      undefined,
      moduleSpec
    );
    statementArray.push(exportDeclaration);
  }
  // Creating a default export statement
  const exportDefault = ts.factory.createExportDefault(
    ts.factory.createObjectLiteralExpression([
      ...files.map((f) => {
        return ts.factory.createSpreadAssignment(ts.factory.createIdentifier(f));
      }),
    ])
  );
  statementArray.push(exportDefault);
  createTypeScriptFile(outDir, 'index.ts', statementArray);
}

/**
 * Create a TypeScript file on the filesystem.
 * @param dir - Directory for the file.
 * @param name - Name of the file.
 * @param statements - Statements to include in the file.
 */
function createTypeScriptFile(dir: string, name: string, statements: ts.Statement[]) {
  const file = ts.createSourceFile(name, '', ts.ScriptTarget.ESNext);
  const fileWithStatements = ts.factory.updateSourceFile(file, statements);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const code = printer.printFile(fileWithStatements);
  fs.writeFileSync(path.join(dir, file.fileName), code);
}

generate();
