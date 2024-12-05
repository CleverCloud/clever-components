/**
 * Rule to enforce using `sanitize` function as a template literal and not as a regular function.
 * Check the `docs/translations.example.js` file for more details.
 *
 * Note: this rule only applies in translation files.
 *
 * Limitations: the automatic fix script only affects `sanitize()` call with a single parameter,
 * which must be a template literal (`TemplateLiteral` AST type).
 */

import { getClosestParentFromType, isTranslationFile } from './i18n-shared.js';

function report(context, key, callExpressionNode) {
  context.report({
    node: callExpressionNode,
    messageId: 'sanitizeAlwaysTemplateLiteral',
    data: { key },
    fix: (fixer) => {
      if (callExpressionNode.arguments?.length !== 1) {
        return;
      }

      const argument = callExpressionNode.arguments[0];
      if (argument.type === 'TemplateLiteral') {
        const contents = context.getSourceCode().text.substring(argument.range[0], argument.range[1]);
        return fixer.replaceText(callExpressionNode, `sanitize${contents}`);
      }
    },
  });
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce template literal when using the sanitize function',
      category: 'Translation files',
    },
    fixable: 'code',
    messages: {
      sanitizeAlwaysTemplateLiteral: 'Missing template literal usage with sanitize function: {{key}}',
    },
  },
  create: function (context) {
    // Early return for non translation files
    if (!isTranslationFile(context)) {
      return {};
    }

    return {
      CallExpression(node) {
        if (node.callee.name === 'sanitize') {
          const parentProperty = getClosestParentFromType(node, 'Property');

          if (parentProperty != null) {
            report(context, parentProperty.key.value, node);
          }
        }
      },
    };
  },
};
