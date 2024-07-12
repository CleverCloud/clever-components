import chalk from 'chalk';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import ts from 'typescript';
import { getTypesFromClass } from '../cem/support-typedef-jsdoc-utils.js';

function checkTypeImports(componentName, filepath, sourceCode) {
  const sourceAst = ts.createSourceFile(componentName, sourceCode, ts.ScriptTarget.ES2015, true);
  const classNodes = sourceAst.statements.filter((node) => node.kind === ts.SyntaxKind.ClassDeclaration);
  const typesFromFile = classNodes.map((node) => node.name.escapedText);
  const typesFromImports = sourceAst.statements
    .filter((node) => node.kind === ts.SyntaxKind.ImportDeclaration)
    .flatMap((node) => {
      return node.importClause?.namedBindings?.elements?.map((b) => b.name.escapedText);
    })
    .filter((n) => n != null);

  const imports = { component: componentName, filepath: filepath, errors: [], missingImports: [] };

  for (const classNode of classNodes) {
    // The plugin takes variables that are both
    // - initialized in the constructor (both public and private)
    // - declared in @fires JsDoc tags
    // and takes all the available imports : which are imports found in @typedef, import statements and current file classes.
    // Then it verifies that every type used within the constructor is imported within a @typedef
    // Finally it tells you if you have missing imports or @typedef in the wrong format
    const types = getTypesFromClass(classNode, ts, true);
    if (types.length === 0) {
      continue;
    }

    const typesFromTypeDef = [];
    classNode?.jsDoc?.forEach((jsDoc) => {
      if (jsDoc.tags != null) {
        const typedefs = jsDoc.tags
          .filter((tag) => tag.kind === ts.SyntaxKind.JSDocTypedefTag)
          .map((typedef) => ({ type: typedef.name?.getText(), typedef: typedef.getText() }));
        typesFromTypeDef.push(...typedefs);
      }
    });

    types.forEach((type) => {
      const fromTypeDef = typesFromTypeDef.find(({ type: typeDefType }) => type === typeDefType);
      const isDomRelated = type === 'Animation' || type === 'Element' || type === 'Node';
      const isDefinedInFile = typesFromFile.includes(type);
      const isDefinedInImports = typesFromImports.includes(type);
      if (fromTypeDef == null && !isDomRelated && !isDefinedInFile && !isDefinedInImports) {
        imports.missingImports.push(type);
      }
    });

    typesFromTypeDef.forEach(({ type, typedef }) => {
      if (type == null) {
        imports.errors.push(typedef);
      }
    });
  }

  return imports;
}

function run() {
  console.log(
    chalk.bgWhite.black.bold(`\n ⌛ checking @typedef imports and types present in constructor and @fires tags.\n`),
  );

  const wrongImports = [];
  const componentsList = glob.sync('src/components/**/cc-*.js', {
    absolute: true,
    ignore: ['src/components/**/cc-*.stories.js', 'src/components/**/cc-*.smart*', 'src/components/**/cc-*.test.js'],
  });

  for (const filepath of componentsList) {
    const componentFileName = path.parse(filepath).name;
    const contents = fs.readFileSync(filepath, { encoding: 'utf8' });
    const imports = checkTypeImports(componentFileName, filepath, contents);
    if (imports != null && (imports.missingImports.length !== 0 || imports.errors.length !== 0)) {
      wrongImports.push(imports);
    }
  }

  if (wrongImports.length === 0) {
    console.log(chalk.bgGreen.bold(` 🎉 No type import issues in the components! `));
    return process.exit(0);
  }

  wrongImports.forEach(({ component, filepath, errors, missingImports }) => {
    console.log(chalk.bgWhite.black.bold(`🔍 ${component} - ${filepath} \n`));

    if (errors.length !== 0) {
      errors.forEach((error) => console.error(chalk.red.bold(`❌ Something might be wrong for @typedef: `), error));
    }
    if (missingImports.length !== 0) {
      console.log(chalk.bgYellow.black.bold(`⚠️  Missing import(s) are: `));
      missingImports.forEach((type) => console.warn(`\t - ${type}\n`));
    }
  });
  return process.exit(1);
}

run();
