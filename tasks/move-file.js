import fs from 'fs';
import path from 'path';
import { parse } from '@babel/core';
import chalk from 'chalk';
import { walk } from 'estree-walker';
import glob from 'glob';
import MagicString from 'magic-string';

function getRelativePath (baseFile, otherFile) {
  const fileDir = path.parse(baseFile).dir;
  const relativeLinkPath = path.relative(fileDir, otherFile);
  if (relativeLinkPath.startsWith('./') || relativeLinkPath.startsWith('../')) {
    return relativeLinkPath;
  }
  return `./${relativeLinkPath}`;
}

function isRelativeImport (node) {
  return (
    true
    && (node.type === 'ImportDeclaration')
    && (
      false
      || node.source.value.startsWith('./')
      || node.source.value.startsWith('../')
    )
  );
}

function isNewUrlImportMetaUrl (node) {
  return (
    true
    && node.type === 'NewExpression'
    && node.callee.type === 'Identifier'
    && node.callee.name === 'URL'
    && node.arguments.length === 2
    && node.arguments[0].type === 'StringLiteral'
    && node.arguments[1].type === 'MemberExpression'
    && node.arguments[1].object.type === 'MetaProperty'
    && node.arguments[1].property.type === 'Identifier'
    && node.arguments[1].property.name === 'url'
  );
}

function onLink (ast, callback) {
  walk(ast, {
    enter (node, parent, prop, index) {
      if (isRelativeImport(node)) {
        callback(node.source);
      }
      if (isNewUrlImportMetaUrl(node)) {
        callback(node.arguments[0]);
      }
    },
  });
}

export function moveFile (oldPath, newPath) {

  const oldDir = path.parse(oldPath).dir;
  const newDir = path.parse(newPath).dir;

  fs.mkdirSync(newDir, { recursive: true });
  fs.renameSync(oldPath, newPath);
  console.log(`MOVE FILE: ${chalk.blue(path.relative(process.cwd(), oldPath))} => ${chalk.green(path.relative(process.cwd(), newPath))}`);

  try {
    const code = fs.readFileSync(newPath, { encoding: 'utf8' });
    const ast = parse(code);
    const ms = new MagicString(code);

    onLink(ast, (node) => {
      const linkPath = path.resolve(oldDir, node.value);
      const relativeLinkPath = getRelativePath(newPath, linkPath);
      ms.overwrite(node.start, node.end, `'${relativeLinkPath}'`);
      console.log(`  OUTER: ${chalk.blue(node.value)} => ${chalk.green(relativeLinkPath)}`);
    });

    const newCode = ms.toString();
    fs.writeFileSync(newPath, newCode);
  }
  catch (e) {
    // Not a JavaScript file
  }
}

export function copyFile (oldPath, newPath) {
  fs.cpSync(oldPath, newPath);
  console.log(`COPY FILE: ${chalk.blue(path.relative(process.cwd(), oldPath))} => ${chalk.green(path.relative(process.cwd(), newPath))}`);
}

export function updateOtherFiles (oldPath, newPath, otherGlobs) {

  const otherFiles = otherGlobs.flatMap((pattern) => glob.sync(pattern, { absolute: true }));

  for (const filePath of otherFiles) {

    const fileDir = path.parse(filePath).dir;

    const code = fs.readFileSync(filePath, { encoding: 'utf8' });
    const ast = parse(code);
    const ms = new MagicString(code);

    onLink(ast, (node) => {
      const linkPath = path.resolve(fileDir, node.value);
      if (linkPath === oldPath) {
        const relativeLinkPath = getRelativePath(filePath, newPath);
        ms.overwrite(node.start, node.end, `'${relativeLinkPath}'`);
        console.log(`  INNER(${chalk.yellow(path.relative(process.cwd(), filePath))}): ${chalk.blue(node.value)} => ${chalk.green(relativeLinkPath)}`);
      }
    });

    const newCode = ms.toString();
    fs.writeFileSync(filePath, newCode);
  }
}

export function moveFileAndUpdateCodebase (rawOldPath, rawNewPath, otherGlobs) {
  const oldPath = path.isAbsolute(rawOldPath) ? rawOldPath : path.resolve(process.cwd(), rawOldPath);
  const newPath = path.isAbsolute(rawNewPath) ? rawNewPath : path.resolve(process.cwd(), rawNewPath);
  moveFile(oldPath, newPath);
  updateOtherFiles(oldPath, newPath, otherGlobs);
}
