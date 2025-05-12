import fs from 'node:fs';
import path from 'node:path';

/**
 * @typedef {import('@custom-elements-manifest/analyzer').Plugin} Plugin
 * @typedef {import('custom-elements-manifest/schema.js').Declaration} Declaration
 * @typedef {import('custom-elements-manifest/schema.js').Event} Event
 * @typedef {import('typescript').ClassDeclaration} ClassDeclaration
 * @typedef {import('typescript').JSDoc} JSDoc
 */

/**
 * This plugin clears all events documentation detected by the standard CEM analyzer.
 *
 * It also adds events documentation for every import to a `CcEvent` class from a `*.events.js` module.
 *
 * @returns {Plugin}
 */
export default function supportCcEvents() {
  return {
    name: 'support-cc-events',
    analyzePhase({ ts, node, moduleDoc }) {
      if (ts.isClassDeclaration(node) && ts.isSourceFile(node.parent)) {
        const cemClassDeclaration = moduleDoc.declarations.find(
          /** @param {Declaration} declaration */ (declaration) => declaration.name === node.name.getText(),
        );
        cemClassDeclaration.events = [];

        const modulePath = path.resolve(process.cwd(), path.dirname(moduleDoc.path));

        // collect imported event classes from import statements
        // -> takes all named imports from module that ends with `.events.js`
        /** @type {Map<string, Array<string>>} */
        const eventModulesMap = new Map();
        node.parent.statements.forEach((statement) => {
          if (
            ts.isImportDeclaration(statement) &&
            ts.isStringLiteral(statement.moduleSpecifier) &&
            statement.moduleSpecifier.text.endsWith('.events.js') &&
            ts.isNamedImports(statement.importClause.namedBindings)
          ) {
            const moduleRelativePath = statement.moduleSpecifier.text;

            statement.importClause.namedBindings.elements.forEach((element) => {
              const className = element.name.getText();
              const importPath = path.resolve(modulePath, moduleRelativePath);
              let eventClasses = eventModulesMap.get(importPath);
              if (eventClasses == null) {
                eventModulesMap.set(importPath, [className]);
              } else {
                eventClasses.push(className);
              }
            });
          }
        });

        // parse AST of all collected modules and get:
        // - event name from `TYPE` static member
        // - description from JSDoc comment
        eventModulesMap.forEach((eventClasses, modulePath) => {
          const source = fs.readFileSync(modulePath).toString();
          const eventModule = ts.createSourceFile(modulePath, source, ts.ScriptTarget.ES2015, true);

          eventClasses.forEach((eventClassName) => {
            const classDeclaration = /** @type {ClassDeclaration} */ (
              eventModule.statements.find(
                (statement) => ts.isClassDeclaration(statement) && statement.name.getText() === eventClassName,
              )
            );

            if (classDeclaration != null) {
              const eventNameMember = classDeclaration.members.find((member) => member.name.getText() === 'TYPE');
              if (ts.isPropertyDeclaration(eventNameMember) && ts.isStringLiteral(eventNameMember.initializer)) {
                const eventName = eventNameMember.initializer.text;

                /** @type {Event} */
                const cemEvent = {
                  name: eventName,
                  type: {
                    text: eventClassName,
                  },
                };
                cemClassDeclaration.events.push(cemEvent);

                const jsDocCommentsAndTags = ts.getJSDocCommentsAndTags(classDeclaration);
                if (jsDocCommentsAndTags.length > 0) {
                  cemEvent.description = ts.getTextOfJSDocComment(jsDocCommentsAndTags[0].comment);
                }
              }
            }
          });
        });
      }
    },
  };
}
