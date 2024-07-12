import chalk from 'chalk';
import { DepGraph } from 'dependency-graph';
import { init, parse } from 'es-module-lexer';
import fs from 'fs';
import path from 'path';
import { SOURCE_DIR, multiGlob } from '../rollup/rollup-common.js';

export function getComponentFiles() {
  const mainFilesPatterns = [`${SOURCE_DIR}/components/**/*.js`];

  const ignorePatterns = [
    `${SOURCE_DIR}/components/**/*.smart*.js`,
    `${SOURCE_DIR}/components/**/*.stories.js`,
    `${SOURCE_DIR}/components/**/*.test.js`,
  ];

  return multiGlob(mainFilesPatterns, { ignore: ignorePatterns });
}

/**
 *
 * This function is used to get a `DepGraph` that allows to find the dependencies nor the dependants of the components easily.
 *
 * @returns {Promise<DepGraph>} - returns a component `DepGraph`.
 */
export async function getComponentsGraph() {
  const componentsGraph = new DepGraph();
  const componentsFileList = getComponentFiles();
  await init;

  // Importer: One component that has one or more imports.
  // Imported: One of the imports needed by the importer.
  // e.g: cc-notice needs cc-icon. In this case, cc-notice is the importer and cc-icon the imported.

  for (const importerFilePath of componentsFileList) {
    const importerFile = fs.readFileSync(importerFilePath, 'utf8');
    const [imports] = parse(importerFile);

    for (const imported of imports) {
      const importerRelative = path.relative(process.cwd(), importerFilePath);
      const importerRelativeDir = path.dirname(importerRelative);
      const sourceRelative = path.join(importerRelativeDir, imported.n);

      if (!componentsGraph.hasNode(importerRelative)) {
        componentsGraph.addNode(importerRelative);
      }

      const isImporterInList = componentsFileList.includes(importerRelative);
      const isImportedInList = componentsFileList.includes(sourceRelative);
      const isImportedLocal = imported.n.startsWith('./') || imported.n.startsWith('../');

      const areInListAndLocal = isImporterInList && isImportedInList && isImportedLocal;

      if (areInListAndLocal && !componentsGraph.hasNode(sourceRelative)) {
        componentsGraph.addNode(sourceRelative);
      }

      if (areInListAndLocal) {
        componentsGraph.addDependency(importerRelative, sourceRelative);
      }
    }
  }

  return componentsGraph;
}

/**
 *
 * @param {number} level
 * @returns {string} Returns a string with the correct number of spaces and `│` dividers.
 *
 */
function getDividers(level) {
  let dividers = '│';

  for (let i = 1; i < level; i++) {
    dividers += `  │ `;
  }

  return dividers;
}

/**
 * This function differs from `getComponentsTree` for various reasons:
 * It only takes a component path as a param instead of a list of components paths
 * It forms a specific `npm ls` like output
 *
 * @param {string} componentPath
 * @param {DepGraph} graph
 * @param {number} [maxLevel=Infinity]
 * @returns {string}
 */
export function getDependantsLsStyle(componentPath, graph, maxLevel = Infinity) {
  let output = '';

  function handleTreeNode(componentPath, componentName = '', level = 0) {
    if (level > maxLevel) {
      return;
    }

    const name = path.basename(componentPath, '.js');
    const deps = graph.directDependenciesOf(componentPath);

    if (level === 0) {
      output += `├─ ${componentName !== '' && name === componentName ? chalk.yellow(name) : name}\n`;
    } else {
      output += `${getDividers(level)}  ├─ ${componentName !== '' && name === componentName ? chalk.yellow(name) : name}\n`;
    }

    for (const dep of deps) {
      handleTreeNode(dep, componentName, level + 1);
    }
  }

  const deps = graph.directDependantsOf(componentPath);
  for (const dep of deps) {
    handleTreeNode(dep, path.basename(componentPath, '.js'));
  }

  return output;
}

/**
 * This function allows you to get either the dependencies or the dependants of one or more components given its path list.
 * It will work whether you provide it with an array of one component path or a full list.
 *
 * @param {string[]} componentsPath
 * @param {DepGraph} graph
 * @param {'dependencies'|'dependants'} [mode='dependencies']
 * @param {number} [maxLevel=Infinity]
 * @returns {string|null}
 */
export function getComponentsTree(componentsPath, graph, mode = 'dependencies', maxLevel = Infinity) {
  // if mode isn't set properly we don't go further
  if (!['dependencies', 'dependants'].includes(mode)) {
    return null;
  }

  let output = '';

  function handleTreeNode(componentPath, level = 0) {
    if (level > maxLevel) {
      return;
    }

    const componentName = path.basename(componentPath, '.js');

    let deps;

    if (mode === 'dependencies') {
      deps = graph.directDependenciesOf(componentPath);
    } else if (mode === 'dependants') {
      deps = graph.directDependantsOf(componentPath);
    }

    if (componentsPath.length === 1 && deps.length === 0 && level === 0) {
      return '';
    }

    if (deps.length >= 0 && level === 0) {
      output += `├─ ${componentName}\n`;
    } else {
      output += `${getDividers(level)}  ├─ ${componentName}\n`;
    }

    for (const dep of deps) {
      handleTreeNode(dep, level + 1);
    }
  }

  for (const componentPath of componentsPath) {
    handleTreeNode(componentPath);
  }

  return output;
}
