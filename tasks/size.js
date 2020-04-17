'use strict';

const path = require('path');
const babel = require('@babel/core');
const { fetchPackageStats } = require('bundle-phobia-cli/src/fetch-package-stats.js');
const fs = require('fs-extra');
const getGzipSize = require('gzip-size');
const table = require('text-table');
const pkg = require('../package.json');

function isImportExportNode (node) {
  return (node.type === 'ExportNamedDeclaration' || node.type === 'ImportDeclaration')
    && node.source != null;
}

function isInternalDep (node) {
  return (node.source.value[0] === '.');
}

const depsCache = {};

async function findDeps (sourceFileName) {

  if (depsCache[sourceFileName] != null) {
    return depsCache[sourceFileName];
  }

  const sourceDir = path.parse(sourceFileName).dir;
  const fileContents = await fs.readFile(sourceFileName, 'utf8');

  const fileRawSize = Buffer.from(fileContents, 'utf-8').length;
  const fileGzipSize = await getGzipSize(fileContents);

  let internalDeps = [];
  let externalDeps = [];

  if (sourceFileName.endsWith('.js')) {

    const ast = await babel.parseAsync(fileContents, {
      sourceFileName,
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
      ],
    });

    const rawDeps = ast.program.body.filter((node) => isImportExportNode(node));

    const rawInternalDeps = rawDeps
      .filter((node) => isInternalDep(node))
      .map((node) => path.join(sourceDir, node.source.value));

    internalDeps = await Promise.all(rawInternalDeps.map((dep) => findDeps(dep)));

    externalDeps = rawDeps
      .filter((node) => !isInternalDep(node))
      .map((node) => ({ name: node.source.value }));
  }

  const result = {
    name: sourceFileName,
    size: {
      raw: fileRawSize,
      gzip: fileGzipSize,
    },
    deps: [...internalDeps, ...externalDeps],
  };

  depsCache[sourceFileName] = result;

  return result;
}

function getComponentName (name, componentList) {
  return (componentList == null || componentList.includes(name))
    ? `<${path.parse(name).name}>`
    : name;
}

function getTotalSize (file) {
  if (file.size == null) {
    return { raw: 0, gzip: 0 };
  }
  else {
    return file.deps
      .map((d) => getTotalSize(d))
      .reduce((acc, size) => ({
        raw: acc.raw + size.raw,
        gzip: acc.gzip + size.gzip,
      }), file.size);
  }
}

function reducePromises (acc, prom, i, all) {
  if (i === all.length - 1) {
    return Promise.all(all);
  }
}

async function run () {

  const externalDeps = await Object
    .entries(pkg.dependencies)
    .map(([name, version]) => {
      return fetchPackageStats(name).catch(() => ({ name }));
    })
    .reduce(reducePromises)
    .then((allDeps) => {
      return allDeps.map((d, i) => ([`[${i}]`, d.name, d.size || '?', d.gzip || '?', '', '']));
    });

  const externalDepsList = externalDeps
    .map(([, name]) => name);

  const mainSource = 'dist/index.js';
  const depTree = await findDeps(mainSource);

  const componentList = depTree.deps.map((a) => a.name);
  const otherDepsList = Object
    .values(depsCache)
    .filter((d) => !componentList.includes(d.name) && d.name !== 'dist/index.js')
    .map((d) => d.name);

  const otherDeps = Object
    .values(depsCache)
    .filter((d) => !componentList.includes(d.name) && d.name !== 'dist/index.js')
    .map((d, i) => {
      const name = d.name.replace(/^dist\//, '');
      return [`(${i})`, name, d.size.raw, d.size.gzip];
    });

  const components = depTree.deps
    .map((a, i) => {
      return [
        `<${i}>`,
        getComponentName(a.name, componentList),
        a.size.raw,
        a.size.gzip,
        getTotalSize(a).raw,
        getTotalSize(a).gzip,
        a.deps.map((d) => {

          const name = externalDepsList.find((n) => d.name.startsWith(n)) || d.name;

          if (externalDepsList.includes(name)) {
            return `[${externalDepsList.indexOf(name)}]`;
          }

          if (otherDepsList.includes(name)) {
            return `(${otherDepsList.indexOf(name)})`;
          }

          if (componentList.includes(name)) {
            return `<${componentList.indexOf(name)}>`;
          }

          return name.replace(/^dist\//, '');
        }).join(' '),
      ];
    });

  const totalComponents = [
    '',
    'ALL COMPONENTS',
    components.reduce((a, b) => a + b[2], 0),
    components.reduce((a, b) => a + b[3], 0),
    [...externalDeps, ...otherDeps].reduce((a, b) => a + (isNaN(b[2]) ? 0 : b[2]), 0),
    [...externalDeps, ...otherDeps].reduce((a, b) => a + (isNaN(b[3]) ? 0 : b[3]), 0),
    '',
  ];

  const displayTable = [

    ['ID', 'NAME', 'raw', 'gzip', 'raw', 'gzip'],
    ['--', '---------', '-----', '-----', '-----', '-----'],
    ...externalDeps,
    ['--', '---------', '-----', '-----', '-----', '-----'],
    ...otherDeps,
    ['--', '---------', '-----', '-----', '-----', '-----'],
    totalComponents,
    ...components,
  ];

  console.log(table(displayTable, { align: ['r', 'l', 'r', 'r', 'r', 'r'] }));
}

run()
  .then(console.log)
  .catch(console.error);
