import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import glob from 'glob';
import ts from 'typescript';

import { getConstructorNode, getTypesFromConstructor } from '../cem/support-typedef-jsdoc-utils.js';

function checkTypeImports (componentName, filepath, sourceCode) {
  const sourceAst = ts.createSourceFile(componentName, sourceCode, ts.ScriptTarget.ES2015, true);
  const classNode = sourceAst.statements.find((node) => node.kind === ts.SyntaxKind.ClassDeclaration);
  const constructorNode = getConstructorNode(classNode, ts);

  if (constructorNode == null) {
    return;
  }

  // The plugin takes variables that are initialized in the constructor (both public and private)
  // and takes all the @typedef imports present for each component.
  // Then it verifies that there's a match between each constructor variables types and @typedef imports
  // Finally it tells you if you have missing, unused imports or @typedef in the wrong format
  const typesFromConstructor = getTypesFromConstructor(constructorNode, ts, true);
  const imports = { component: componentName, filepath: filepath, unusedImports: [], errors: [], missingImports: [] };
  const typesFromTypeDef = [];
  classNode?.jsDoc?.forEach((jsDoc) => {
    const typedefs = jsDoc.tags
      .filter((tag) => tag.kind === ts.SyntaxKind.JSDocTypedefTag)
      .map((typedef) => ({ type: typedef.name?.getText(), typedef: typedef.getText() }));
    typesFromTypeDef.push(...typedefs);
  });

  typesFromConstructor.forEach((type) => {
    const fromTypeDef = typesFromTypeDef.find(({ type: typeDefType }) => type === typeDefType);
    const isDomRelated = type === 'Animation' || type === 'Element' || type === 'Node';
    if (fromTypeDef == null && !isDomRelated) {
      imports.missingImports.push(type);
    }

  });

  typesFromTypeDef.forEach(({ type, typedef }) => {
    const isDomRelated = type === 'Animation' || type === 'Element' || type === 'Node';
    if (type != null && !typesFromConstructor.includes(type) && !isDomRelated) {
      imports.unusedImports.push({ type, typedef });
    }

    if (type == null) {
      imports.errors.push(typedef);
    }
  });

  return imports;

}

function run () {
  console.log(
    chalk
      .bgWhite
      .black
      .bold(`\n ⌛ checking @typedef imports and types present in constructor.\n`),
  );

  const wrongImports = [];
  const componentsList = glob.sync('src/components/**/cc-*.js', {
    absolute: true,
    ignore: [
      'src/components/**/cc-*.stories.js',
      'src/components/**/cc-*.smart*',
      'src/components/**/cc-*.test.js',
    ],
  });

  for (const filepath of componentsList) {
    const componentFileName = path.parse(filepath).name;
    const contents = fs.readFileSync(filepath, { encoding: 'utf8' });
    const imports = checkTypeImports(componentFileName, filepath, contents);
    if (imports != null && (imports.unusedImports.length !== 0 || imports.missingImports.length !== 0 || imports.errors.length !== 0)) {
      wrongImports.push(imports);
    }
  }

  if (wrongImports.length === 0) {
    console.log(
      chalk
        .bgGreen
        .bold(` 🎉 No type imports in the components are unused! `),
    );
    return process.exit(0);
  }

  wrongImports.forEach(({ component, filepath, errors, unusedImports, missingImports }) => {
    console.log(
      chalk
        .bgWhite
        .black
        .bold(`🔍 ${component} - ${filepath} \n`),
    );

    if (errors.length !== 0) {
      errors.forEach((error) => console.error(
        chalk
          .red
          .bold(`❌ Something might be wrong for @typedef: `), error),
      );
    }
    if (unusedImports.length !== 0) {
      console.log(
        chalk
          .bgYellow
          .black
          .bold(`⚠️  Unused import(s) are: `),
      );
      unusedImports.forEach(({ typedef }) => console.warn(`\t - ${typedef}\n`));
    }
    if (missingImports.length !== 0) {
      console.log(
        chalk
          .bgYellow
          .black
          .bold(`⚠️  Missing import(s) are: `),
      );
      missingImports.forEach((type) => console.warn(`\t - ${type}\n`));
    }
  });
  return process.exit(1);
}

run();
