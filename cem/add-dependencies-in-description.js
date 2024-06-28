/**
 * CEM analyzer plugin: add-dependencies-in-description
 *
 * This plugin adds the dependencies and the dependants at the description of each component if they have some.
 */
import {
  getComponentsGraph,
  getComponentsTree,
} from '../tasks/component-usage-graph.js';

const graph = await getComponentsGraph();

export default function addDependenciesInDescription () {

  return {
    name: 'add-dependencies-in-description',
    moduleLinkPhase ({ moduleDoc }) {

      const isComponent = moduleDoc.path.includes('src/components/');
      const isSmartComponent = moduleDoc.path.includes('.smart');

      const shouldProcess = isComponent && !isSmartComponent;
      const dependencies = shouldProcess ? getComponentsTree([moduleDoc.path], graph, 'dependencies') : '';
      const dependants = shouldProcess ? getComponentsTree([moduleDoc.path], graph, 'dependants', 1) : '';

      let sourceLine = '';
      if (dependencies !== '') {
        sourceLine += '### Dependencies\n' + '```\n' + dependencies + '\n```';
      }
      if (dependants !== '') {
        sourceLine += '\n\n### Dependants\n' + '```\n' + dependants + '\n```';
      }

      moduleDoc.declarations
        ?.filter((declaration) => declaration.kind === 'class')
        ?.forEach((declaration) => {
          declaration.description += '\n\n' + sourceLine;
        });
    },
  };
}
