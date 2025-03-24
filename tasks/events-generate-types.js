import fs from 'node:fs';
import path from 'node:path';
import * as prettier from 'prettier';
import { globSync } from 'tinyglobby';
import ts from 'typescript';

/**
 * @typedef {import('typescript').ClassDeclaration} ClassDeclaration
 */

const basePath = process.cwd();
const eventsFilesPattern = path.join(basePath, './src/**/*.events.js');
const outputPath = path.join(basePath, './src/lib/events.global.types.d.ts');

console.log(import.meta.url);
console.log(basePath);
console.log('input', eventsFilesPattern);
console.log('output', outputPath);

/**
 * @param {string} modulePath
 * @returns {string}
 */
function getImport(modulePath) {
  const dir = path.dirname(outputPath);
  const relativePath = path.relative(dir, modulePath);
  if (relativePath.startsWith('.')) {
    return relativePath;
  } else {
    return `./${relativePath}`;
  }
}

/**
 * @returns {Promise<string>}
 */
async function generateEventTypes() {
  console.log(`Collecting events from ${eventsFilesPattern}...`);

  const events = globSync([eventsFilesPattern])
    .flatMap((modulePath) => {
      const source = fs.readFileSync(modulePath).toString();
      const eventModule = ts.createSourceFile(modulePath, source, ts.ScriptTarget.ES2015, true);
      return eventModule.statements
        .filter((statement) => ts.isClassDeclaration(statement))
        .map((classDeclaration) => /** @type {ClassDeclaration} */ (classDeclaration))
        .map((classDeclaration) => {
          const eventNameMember = classDeclaration.members.find((member) => member.name.getText() === 'TYPE');
          if (ts.isPropertyDeclaration(eventNameMember) && ts.isStringLiteral(eventNameMember.initializer)) {
            let description;
            const jsDocCommentsAndTags = ts.getJSDocCommentsAndTags(classDeclaration);
            if (jsDocCommentsAndTags.length > 0) {
              description = ts.getTextOfJSDocComment(jsDocCommentsAndTags[0].comment);
            }

            return {
              import: getImport(modulePath),
              className: classDeclaration.name.getText(),
              name: eventNameMember.initializer.text,
              description,
            };
          }

          return null;
        })
        .filter((o) => o != null);
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (events.length === 0) {
    console.log(`> Found no events`);
    process.exit(0);
  }
  console.log(`> Found ${events.length} event(s)`);

  console.log(`Transforming into typescript definition...`);
  /** @type {Array<string>} */
  const imports = [];
  /** @type {Array<string>} */
  const eventMapEntries = [];
  events.forEach((event) => {
    imports.push(`import { ${event.className} } from '${event.import}';`);
    eventMapEntries.push(`'${event.name}': ${event.className};`);
  });

  const definition = `// this file is auto generated. Do not edit manually. 
${imports.join('\n')}

declare global {
  class CcEvent<T> extends CustomEvent<T> {
    constructor(detail: T);
  }

  interface HTMLElementEventMap {
    ${eventMapEntries.join('\n    ')}
  }
}
`;

  console.log(`> Done`);

  console.log(`Formatting code with prettier...`);
  const formatted = await format(definition);
  console.log(`> Done`);

  return formatted;
}

/**
 *
 * @param {boolean} check
 * @returns {Promise<void>}
 */
async function run(check) {
  const types = await generateEventTypes();

  if (check) {
    if (!fs.existsSync(outputPath)) {
      console.error(`\u001B[31mGlobal event typescript file ${outputPath} doesn't exist.\u001B[0m`);
      process.exit(1);
    } else {
      const currentTypes = fs.readFileSync(outputPath).toString();
      if (types !== currentTypes) {
        console.error(`\u001B[31mGlobal event typescript file ${outputPath} is out of sync.\u001B[0m`);
        process.exit(1);
      }
    }
    console.log(`Global event typescript file ${outputPath} is up to date`);
    process.exit(0);
  } else {
    console.log(`Writing global event typescript to ${outputPath}...`);
    fs.writeFileSync(outputPath, types);
    console.log(`> Done`);
  }
}

/**
 * @param {string} raw
 * @returns {Promise<string>}
 */
async function format(raw) {
  const options = await prettier.resolveConfig(path.join(basePath, './.prettierrc'));
  options.parser = 'typescript';
  return prettier.format(raw, options);
}

const check = process.argv.at(-1) === 'check';

run(check).catch((e) => {
  console.error(e);
  process.exit(1);
});
