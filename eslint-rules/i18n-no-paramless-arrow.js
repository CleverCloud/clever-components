'use strict';

const {
  isTranslationFile,
  isMainTranslationNode,
  getTranslationProperties,
  isSanitizeTagFunction,
} = require('./i18n-shared.js');

function report(context, key, arrowNode) {
  context.report({
    node: arrowNode,
    messageId: 'paramlessArrow',
    data: { key },
    fix: (fixer) => {
      const source = context.getSource();
      const bodyString = source.substring(arrowNode.body.start, arrowNode.body.end);
      return fixer.replaceText(arrowNode, bodyString);
    },
  });
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'prevent arrow function usage when the translation is just a string without any parameters',
      category: 'Translation files',
    },
    fixable: 'code',
    messages: {
      paramlessArrow: 'Useless parameter-less arrow function: {{key}}',
    },
  },
  create: function (context) {
    // Early return for non translation files
    if (!isTranslationFile(context)) {
      return {};
    }

    return {
      ExportNamedDeclaration(node) {
        // Early return for nodes that aren't the one exporting translations
        if (!isMainTranslationNode(node)) {
          return;
        }

        const translationProperties = getTranslationProperties(node);

        for (const tp of translationProperties) {
          const key = tp.key.value;

          if (tp.value.type === 'ArrowFunctionExpression' && tp.value.params.length === 0) {
            if (tp.value.body.type === 'TemplateLiteral') {
              report(context, key, tp.value);
            }

            // If it's a paramless arrow function,
            // we must check for the only allowed exception: sanitize tag function:
            // () => sanitize`<em>foo</em>`
            // Checking that sanitize is used with HTML is out of scope.
            if (!isSanitizeTagFunction(tp.value.body)) {
              report(context, key, tp.value);
            }
          }
        }
      },
    };
  },
};
