const { parsers } = require('prettier/parser-babel.js');
const walk = require('estree-walker').walk;

const babelParser = parsers.babel;

function preprocess(code, options) {
  const ast = babelParser.parse(code, options);
  console.log('preprocessing...');

  walk(ast, {
    enter(node, parent, prop, index) {
      if (node.kind === 'constructor') {
        const sortedNodes = handleNodes(node.body.body);
        // sortedNodes.forEach((element) => {
        //   console.log(element.expression.left?.property.name ?? element.expression.callee?.type);
        // });
        node.body.body = sortedNodes;
      }
    },
  });

  return ast;
}

function handleNodes(nodes) {
  return [...nodes].sort((nodeA, nodeB) => {
    // we want to keep super at the top
    if (nodeA.expression.callee?.type === 'Super' || nodeB.expression.callee?.type === 'Super') {
      return 1;
    }
    return nodeA.expression.left?.property.name.localeCompare(nodeB.expression.left?.property.name);
  });
}

module.exports = {
  parsers: {
    babel: {
      ...babelParser,
      parse: preprocess,
    },
  },
};
