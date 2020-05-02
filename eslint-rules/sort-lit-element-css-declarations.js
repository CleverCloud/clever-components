'use strict';

const postcss = require('postcss');
const postCssSorting = require('postcss-sorting');

const postCssSortingOptions = {
  order: [
    'custom-properties',
    'declarations',
  ],
  'properties-order': 'alphabetical',
};

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce CSS declaration sorting in LitElement styles',
      category: 'Stylistic Issues',
    },
    fixable: 'code',
    messages: {
      incorrectSortOrder: 'Incorrect CSS declarations sort order in LitElement styles.',
    },
  },
  create: function (context) {

    return {
      TaggedTemplateExpression (node) {

        // Only works on simple CSS (without holes)
        if (node.tag.name === 'css' && node.quasi.quasis.length === 1) {

          const inputCss = node.quasi.quasis[0].value.raw;

          // postcss-sorting is sync so it's OK to run postcss without async/promise
          const outputCss = postcss([postCssSorting(postCssSortingOptions)])
            .process(inputCss)
            .css;

          if ((inputCss !== outputCss)) {
            context.report({
              node,
              messageId: 'incorrectSortOrder',
              fix: (fixer) => fixer.replaceText(node.quasi.quasis[0], `\`${outputCss}\``),
            });
          }

        }
      },
    };
  },
};
