import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { processWordsList } from './utils';

const projectDir = path.join(__dirname, '..');

export function generate(options: {
  source: string;
  output: string;
  dialects: string[];
  frequencies: number[];
}) {
  process.stdout.write('Generating words with options:\n');
  process.stdout.write('--------------------------------------------------\n');
  process.stdout.write(`${JSON.stringify(options, null, 2)}\n`);
  process.stdout.write('--------------------------------------------------\n');
  const { source, output, dialects, frequencies } = options;
  const outputDirPath = path.join(projectDir, output);
  const sourceDirPath = path.join(projectDir, source);

  fs.mkdir(outputDirPath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const filteredWords = fs.readFileSync(path.join(sourceDirPath, '_filtered.json'), 'utf-8');
  const splitFilteredWords: string[] = JSON.parse(filteredWords);

  process.stdout.write('Generating each dialects words...\n');
  dialects.forEach((dialect) => {
    if (dialect === '__filtered') {
      return;
    }
    process.stdout.write(`  ${dialect}... `);
    const filename = `${dialect}.json`;
    const fileContent = fs.readFileSync(path.join(sourceDirPath, filename), 'utf-8');
    const fileJSON: Record<string, string[]> = JSON.parse(fileContent);
    const dialectFrequencies: Array<{ name: string; words: string[]; isNotBad: boolean }> = [];
    frequencies.forEach((frequency) => {
      process.stdout.write(` ${frequency}..`);
      const content = fileJSON[frequency];
      const [filteredWords, badwords] = processWordsList(content, splitFilteredWords);
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
    createDialectFile(dialect, dialectFrequencies, outputDirPath);
  });
  process.stdout.write('Generating dialects complete.\n');
  process.stdout.write('Generating index file...\n');
  // Generate index.ts file linking all subfiles
  const files = dialects.map((value) => value);
  createIndexFile(files, outputDirPath);
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
  frequencies: { name: string; words: string[]; isNotBad: boolean }[],
  outDir: string
) {
  const statementArray: ts.Statement[] = [];
  // Add array for each frequency.
  for (const f of frequencies) {
    const frequencyArray = createExportedConstStringArray(
      f.name,
      f.words.map((w) => ts.factory.createStringLiteral(w))
    );
    statementArray.push(frequencyArray);
  }
  // Add array for all (filtered words) of the dialect.
  const all = createExportedConstStringArray(
    `${dialect}All`,
    frequencies
      .filter((f) => f.isNotBad)
      .map((f) => ts.factory.createSpreadElement(ts.factory.createIdentifier(f.name)))
  );
  statementArray.push(all);
  // List of all bad words
  const allBad = createExportedConstStringArray(
    `${dialect}BadAll`,
    frequencies
      .filter((f) => !f.isNotBad)
      .map((f) => ts.factory.createSpreadElement(ts.factory.createIdentifier(f.name)))
  );
  statementArray.push(allBad);
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
