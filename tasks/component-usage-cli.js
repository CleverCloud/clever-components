import chalk from 'chalk';
import { parseArgs } from 'node:util';
import {
  getComponentFiles,
  getComponentsGraph,
  getComponentsTree,
  getDependantsLsStyle,
} from './component-usage-graph.js';

// CLI args options

const args = process.argv.slice(2);
const options = {
  all: {
    type: 'boolean',
    short: 'a',
  },
  depth: {
    type: 'string',
    short: 'd',
  },
  help: {
    type: 'boolean',
    short: 'h',
  },
  'used-by': {
    type: 'string',
  },
  uses: {
    type: 'string',
    short: 'u',
  },
};

const { values } = parseArgs({ args, options });

const depth = values?.depth ? Number(values.depth) : null;
const all = values?.all ? Infinity : null;
const uses = values?.uses ? String(values?.uses) : null;
const usedBy = values?.['used-by'] ? String(values?.['used-by']) : null;

function reportError(msg) {
  console.log(chalk.red.bold(`❌ ${msg}`));
  return process.exit(0);
}

if (values?.help) {
  console.log(`
    Command: npm run components:graph-usage -- --depth number|--all --uses|--used-by global|cc-component
    --depth (alias -d): Depth of the tree - value: number.
    --all (alias -a): The depth of tree will be infinity - value: no value.
    --uses (alias -u): Lists the components that use the component given in value param - value: global for all the components|cc-component for a specific component.
    --used-by : Lists the components needed by the component given in value param - value: global for all the components|cc-component for a specific component.

    Note:
    * --uses or --used-by must be provided.
    * --uses and --used-by can't be used together
    * --depth and --all can't be used together.
    * The depth of the tree will be:
      * 1 for global by default
      * Infinity when specifying a component by default
  `);
  process.exit(0);
}

if (isNaN(depth)) {
  reportError(`Depth provided was not a number.`);
}

if (all != null && depth != null) {
  reportError(`❌ Can't have both --depth and --all together.`);
}

if (uses != null && usedBy != null) {
  reportError(`❌ Can't have --uses and --used-by together.`);
} else if (uses == null && usedBy == null) {
  reportError(`❌ --uses or --used-by param is missing. Use --help for more information.`);
}

if ((uses != null && !isComponent(uses)) || (usedBy != null && !isComponent(usedBy))) {
  reportError(`❌ The argument you provided doesn't seem to be a component.`);
}

function isComponent(input) {
  return input.startsWith('cc-') || input === 'global';
}

const graph = await getComponentsGraph();

let component = '';
let mode = null;
let maxLevel = 1;

if (uses === 'global') {
  mode = 'uses-g';
  maxLevel = Infinity;
  component = 'global';
} else if (uses != null) {
  mode = 'uses';
  component = uses;
} else if (usedBy === 'global') {
  mode = 'used-by';
  component = 'global';
  maxLevel = Infinity;
} else if (usedBy != null) {
  mode = 'used-by';
  component = usedBy;
}

if (depth != null) {
  maxLevel = depth;
} else if (all != null) {
  maxLevel = all;
}

let componentsInput;

if (component === 'global') {
  componentsInput = getComponentFiles();
} else if (component !== 'global' && (mode === 'uses' || mode === 'used-by')) {
  componentsInput = [`src/components/${component}/${component}.js`];
}

let result = '';

switch (mode) {
  case 'uses-g':
    result = getComponentsTree(componentsInput, graph, 'dependants', maxLevel);
    break;
  case 'uses':
    result = getDependantsLsStyle(componentsInput[0], graph, maxLevel);
    break;
  case 'used-by':
    result = getComponentsTree(componentsInput, graph, 'dependencies', maxLevel);
    break;
}

if (result === '') {
  console.log(chalk.bgYellow.black.bold(`⚠️  No dependencies or dependants were found.`));
} else {
  console.log(result);
}

process.exit(0);
