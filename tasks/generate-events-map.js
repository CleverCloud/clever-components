import fs from 'node:fs';
import path from 'node:path';
import { format, resolveConfig } from 'prettier';
import { globSync } from 'tinyglobby';
import ts from 'typescript';

/**
 * @typedef EventDeclaration
 * @property {string} name
 * @property {string} className
 * @property {string} modulePath
 * @property {string} import
 * @property {string} [description]
 */

/**
 * @typedef {import('typescript').ClassDeclaration} ClassDeclaration
 */

const BASE_PATH = process.cwd();
const EVENTS_FILES_PATTERN = path.join(BASE_PATH, './src/**/*.events.js');
const OUTPUT_PATH = path.join(BASE_PATH, './src/lib/events-map.types.d.ts');

/** @type {Record<string, string>} */
const GLOBAL_EVENTS = {
  CcInputEvent: 'class CcInputEvent<T = string> extends CcEvent<T> {}',
  CcSelectEvent: 'class CcSelectEvent<T extends string = string> extends CcEvent<T> {}',
  CcMultiSelectEvent: 'class CcMultiSelectEvent<T extends string = string> extends CcEvent<Array<T>> {}',
};

/**
 * @param {string} modulePath
 * @returns {string}
 */
function getImport(modulePath) {
  const dir = path.dirname(OUTPUT_PATH);
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
  console.log(`Collecting events from ${EVENTS_FILES_PATTERN}...`);

  /** @type {Map<string, EventDeclaration>} */
  const eventsMap = new Map();

  globSync([EVENTS_FILES_PATTERN]).flatMap((modulePath) => {
    const source = fs.readFileSync(modulePath).toString();
    const eventModule = ts.createSourceFile(modulePath, source, ts.ScriptTarget.ES2015, true);
    return eventModule.statements
      .filter((statement) => ts.isClassDeclaration(statement))
      .map((classDeclaration) => /** @type {ClassDeclaration} */ (classDeclaration))
      .forEach((classDeclaration) => {
        const eventNameMember = classDeclaration.members.find((member) => member.name.getText() === 'TYPE');
        if (ts.isPropertyDeclaration(eventNameMember) && ts.isStringLiteral(eventNameMember.initializer)) {
          let description;
          const jsDocCommentsAndTags = ts.getJSDocCommentsAndTags(classDeclaration);
          if (jsDocCommentsAndTags.length > 0) {
            description = ts.getTextOfJSDocComment(jsDocCommentsAndTags[0].comment);
          }

          const eventName = eventNameMember.initializer.text;
          const eventDeclaration = {
            name: eventName,
            className: classDeclaration.name.getText(),
            modulePath,
            import: getImport(modulePath),
            description,
          };

          if (eventsMap.has(eventName)) {
            const duplicate = eventsMap.get(eventName);
            throw new Error(
              `Duplicate event "${eventName}":\n- class ${eventDeclaration.className} in ${modulePath}\n- class ${duplicate.className} in ${duplicate.modulePath}`,
            );
          }

          eventsMap.set(eventName, eventDeclaration);
        }

        return null;
      });
  });

  if (eventsMap.size === 0) {
    console.log(`> Found no events`);
    process.exit(0);
  }
  console.log(`> Found ${eventsMap.size} event(s)`);

  console.log(`Transforming into typescript definition...`);
  /** @type {Array<string>} */
  const imports = [];
  /** @type {Array<string>} */
  const eventMapEntries = [];
  Array.from(eventsMap.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((event) => {
      if (GLOBAL_EVENTS[event.className] == null) {
        imports.push(`import { ${event.className} } from '${event.import}';`);
      }
      eventMapEntries.push(`'${event.name}': ${event.className};`);
    });

  const definition = `// This file is auto-generated. Do not edit manually.
${imports.join('\n')}

declare global {
  class CcEvent<T> extends CustomEvent<T> {
    constructor(type: string, detail?: T);
  }

  ${Object.values(GLOBAL_EVENTS).join('\n\n')}

  interface GlobalEventHandlersEventMap {
    ${eventMapEntries.join('\n    ')}
  }
}
`;

  console.log(`> Done`);

  console.log(`Formatting code with prettier...`);
  const options = await resolveConfig(path.join(BASE_PATH, './prettier.config.js'));
  options.parser = 'typescript';
  const formatted = await format(definition, options);
  console.log(`> Done`);

  return formatted;
}

/**
 * @param {boolean} check whether to perform only the check if the event map is up to date
 * @returns {Promise<void>}
 */
async function run(check) {
  const types = await generateEventTypes();

  if (check) {
    if (!fs.existsSync(OUTPUT_PATH)) {
      console.error(`\u001B[31mEvents map file ${OUTPUT_PATH} doesn't exist.\u001B[0m`);
      process.exit(1);
    } else {
      const currentTypes = fs.readFileSync(OUTPUT_PATH).toString();
      if (types !== currentTypes) {
        console.error(`\u001B[31mEvents map file ${OUTPUT_PATH} is out of sync.\u001B[0m`);
        process.exit(1);
      }
    }
    console.log(`\u001B[32mEvents map file ${OUTPUT_PATH} is up to date\u001B[0m`);
    process.exit(0);
  } else {
    console.log(`Writing events map to ${OUTPUT_PATH}...`);
    fs.writeFileSync(OUTPUT_PATH, types);
    console.log(`> Done`);
  }
}

const check = process.argv.at(-1) === 'check';

run(check).catch((e) => {
  console.error(e);
  process.exit(1);
});
