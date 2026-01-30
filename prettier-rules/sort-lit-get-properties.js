import traverse from '@babel/traverse';
import * as t from '@babel/types';
import pkg from 'prettier/parser-babel.js';

const { parsers } = pkg;

const babelParser = parsers.babel;

/**
 * @typedef {import('prettier').AST} AST
 * @typedef {t.ObjectMethod | t.ObjectProperty | t.SpreadElement} ObjectPropertiesType
 * @typedef {import('prettier').ParserOptions} ParserOptions
 */

/**
 * @param {string} text
 * @param {ParserOptions} options
 * @returns {AST}
 */
function parse(text, options) {
  const ast = babelParser.parse(text, options);

  /** @type {Array<ObjectPropertiesType>} */
  const props = [];

  let shouldProcess = true;

  traverse.default(ast, {
    ClassMethod: (path) => {
      const isFuncProperties = t.isIdentifier(path.node.key, { name: 'properties' });
      const isProperties =
        path.isClassMethod({
          kind: 'get',
          static: true,
        }) && isFuncProperties;

      if (isProperties && 'argument' in path.node.body.body[0] && 'properties' in path.node.body.body[0].argument) {
        for (const prop of path.node.body.body[0].argument.properties) {
          const isSuperProperties =
            t.isSpreadElement(prop) &&
            t.isMemberExpression(prop.argument) &&
            prop.argument.object?.type === 'Super' &&
            t.isIdentifier(prop.argument.property) &&
            prop.argument.property?.name === 'properties';

          if (!isSuperProperties && t.isSpreadElement(prop)) {
            // If we encounter an unknown spreadElement, we're not sure of what it could override, thus we won't order the properties in this case.
            shouldProcess = false;
            break;
          }

          props.push(prop);
        }

        if (shouldProcess) {
          const sortedProperties = sortProperties(props);
          if (sortedProperties.length > 0) {
            path.node.body.body[0].argument.properties = sortedProperties;
          }
        }
      }
    },
  });

  return ast;
}

/**
 * @param {Array<ObjectPropertiesType>} props
 * @returns {Array<ObjectPropertiesType>}
 */
function sortProperties(props) {
  return props.toSorted((pA, pB) => {
    // These conditions will always be checked on `...super.properties`, so there's no need to check value
    if (t.isSpreadElement(pA)) {
      return -1;
    }
    if (t.isSpreadElement(pB)) {
      return 1;
    }

    if (t.isSpreadElement(pA) && t.isSpreadElement(pB)) {
      return 0;
    }

    const pAName = pA.key.loc.identifierName;
    const pBName = pB.key.loc.identifierName;

    if (pAName.startsWith('_') && !pBName.startsWith('_')) {
      return 1;
    }

    if (pBName.startsWith('_') && !pAName.startsWith('_')) {
      return -1;
    }

    if (pAName === pBName) {
      return 0;
    }

    return pAName < pBName ? -1 : 1;
  });
}

export default {
  parsers: {
    babel: {
      ...babelParser,
      parse,
    },
  },
};
