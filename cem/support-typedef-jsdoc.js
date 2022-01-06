import { readFileSync } from 'fs';
import path from 'path';

// INFO: This is a first iteration of this plugin
// we should add some tests and maybe refactor the code a bit

// Everytime we go through a file in a module if go through it for the first time
// we do cache it so that the other can use it back directly.
const fileCache = new Map();
// And everytime we find a type we do cache it for other files (components) to use them
const typeCache = new Map();

/**
 * The purpose of the function is to loop through each import, open the file and retrieve both the code (text)
 * and the AST associated (if we haven't already stored it in cache). Then, for each type of that import
 * we're gonna check and retrieve their subtypes if it has some. When it's done we're gonna convert it to the text
 * type definition.
 * @param ts
 * @param imports
 * @returns {string}
 */
function convertImports (ts, imports) {
  const asts = [];
  imports.forEach((typesSet, filename) => {
    let sourceCode;
    let sourceAst;
    const inMemory = fileCache.get(filename);
    if (!inMemory) {
      sourceCode = readFileSync(filename).toString();
      sourceAst = ts.createSourceFile(filename, sourceCode, ts.ScriptTarget.ES2015, true);
      fileCache.set(filename, { code: sourceCode, ast: sourceAst });
    }
    else {
      sourceCode = inMemory.code;
      sourceAst = inMemory.ast;
    }

    const typesFromSet = Array.from(typesSet);
    const subtypes = findSubtypes(ts, sourceAst, sourceCode, typesFromSet);
    subtypes.forEach((type) => typesSet.add(type));

    typesSet.forEach((type) =>
      (typeCache.has(type))
        ? asts.push(typeCache.get(type))
        : asts.push(convertInterface(ts, sourceAst, sourceCode, type)));
  });
  return asts.join('\n');
}

/**
 * Convert a type interface to markdown and returns it.
 * @param ts
 * @param node
 * @param code
 * @param interfaceName
 * @returns {string}
 */
function convertInterface (ts, node, code, interfaceName) {
  const st = node?.statements.find((st) => st?.name?.getText() === interfaceName);
  if (st == null) {
    return '';
  }

  const start = st?.modifiers?.find((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)?.end ?? st?.pos;
  const typeDeclaration = code.substring(start, st?.end).trim();
  const typeDisplay = '```ts\n\n'
    + typeDeclaration
    + '\n\n```';
  typeCache.set(interfaceName, typeDisplay);
  return typeDisplay;
}

/**
 * For a list of types, it will loop through each type and find their subtypes associated.
 * It will return all the subtypes of each type looped.
 * @param ts
 * @param node
 * @param code
 * @param types
 * @returns {string[]}
 */
function findSubtypes (ts, node, code, types) {
  const formattedTypes = [];
  types?.forEach((type) => {
    const st = node?.statements.find((st) => st?.name?.getText() === type);

    st?.members?.forEach((member) => {
      // We need the OR for the same reason as above to catch types who are array of objects
      if (member.type.kind === ts.SyntaxKind.TypeReference || member.type?.elementType?.kind === ts.SyntaxKind.TypeReference) {
        const type = member.type?.typeName?.getText() || member.type?.elementType?.typeName?.getText();
        const foundType = node?.statements.find((st) => {
          return (st.kind === ts.SyntaxKind.InterfaceDeclaration || st.kind === ts.SyntaxKind.TypeAliasDeclaration) && st.name.getText() === type;
        });

        if (foundType != null) {
          formattedTypes.push(type);
          formattedTypes.push(...findSubtypes(ts, node, code, [type]));
        }
      }
    });
  });
  return formattedTypes;
}

export default function supportTypedefJsdoc () {
  const rootDir = process.cwd();
  return {
    name: 'support-typedef-jsdoc',
    // go through public fields in constructor
    // list all public types
    // list all imports
    // convert imports to AST
    // extract types and subtypes only once
    // for one path of file store file and AST in RAM (cache)
    // Put ## type definitions if there's types import
    analyzePhase ({ ts, node, moduleDoc }) {
      if (node.kind !== ts.SyntaxKind.ClassDeclaration) {
        return;
      }

      // First, we need to find the constructor
      const constructor = node?.members.find((mb) => mb.kind === ts.SyntaxKind.Constructor);
      const types = [];
      const imports = new Map();

      // Then we loop over it to find the public fields and add them in our types list
      // if the type is not private and not primitive
      constructor?.body.statements.forEach((mb) => {
        const fieldName = mb?.expression?.left?.name.getText();
        const isFieldPrivate = fieldName?.[0] === '_';
        const isFieldTypeUnion = mb.jsDoc?.[0].tags?.[0].typeExpression?.type.kind === ts.SyntaxKind.UnionType;
        const fieldDoc = mb.jsDoc?.[0].tags?.[0].typeExpression;
        // We need to have an "OR" (||) to find types who are object arrays e.g: Plan[] for example
        const customType = fieldDoc?.type?.typeName?.getText() || fieldDoc?.type?.elementType?.typeName?.getText();

        if (!isFieldPrivate && isFieldTypeUnion) {
          fieldDoc.type.types.forEach((type) => {
            // We need to have an "OR" (||) to find types who are object arrays e.g: Plan[] for example
            const customType = type?.typeName?.getText() || type?.elementType?.typeName?.getText();
            if (customType != null) {
              types.push(customType);
            }
          });
        }
        else if (!isFieldPrivate && customType) {
          types.push(customType);
        }
      });

      // Then, we loop through each element of the jsdoc in order to find the type imports
      node?.jsDoc?.forEach((jsDoc) => {

        // For each tags we're gonna extract the file path of the "types.d.ts" file
        // Then, we're gonna check that we have a matching type from the types we found previously
        // in the constructor and add it to our imports set
        jsDoc?.tags
          ?.filter((tag) => tag.tagName.getText() === 'typedef' && (tag.typeExpression.type.kind === ts.SyntaxKind.ImportType))
          ?.forEach((tag) => {

            const moduleDir = path.parse(moduleDoc.path).dir;
            // Remove leading and ending quotes
            const typeRelativePath = tag.typeExpression.type.argument?.literal.getText().slice(1, -1);
            const { dir: typeDir, name: typeName } = path.parse(typeRelativePath);

            const typeToTs = path.format({ name: typeName, ext: '.d.ts' });
            const typePath = path.resolve(rootDir, moduleDir, typeDir, typeToTs);

            const typeDefDisplay = tag.name.getText();
            const type = types.find((type) => type === typeDefDisplay);

            if (type != null) {
              (!imports.has(typePath))
                ? imports.set(typePath, new Set([type]))
                : imports.get(typePath).add(type);
            }

          });

      });

      // Now that we have the types, and the path of where the types are located
      // We can convert the imports to md types
      const convertedImports = convertImports(ts, imports);
      const displayText = (convertedImports) ? '### Type Definitions\n\n' + convertedImports : '';
      const declaration = moduleDoc.declarations.find((declaration) => declaration.name === node.name.getText());

      declaration.description = declaration.description + '\n\n' + displayText;

    },
  };
}
