'use strict';

const {
  isTranslationFile,
  isMainTranslationNode,
  getTranslationProperties,
  isSanitizeTagFunction,
} = require('./i18n-shared.js');

function report (context, key, node) {

  const isLiteralString = (node.type === 'Literal') && (typeof node.value === 'string');

  const messageId = isLiteralString ? 'unexpectedLiteralString' : 'unexpectedTranslationType';
  const fix = isLiteralString ? (fixer) => fixer.replaceText(node, `\`${node.value}\``) : null;

  context.report({
    node,
    messageId,
    data: { key },
    fix,
  });
}

function reportMissingReturn (context, key, node) {
  context.report({
    node,
    messageId: 'missingReturnStatement',
    data: { key },
  });
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce rules on translation values',
      category: 'Translation files',
    },
    fixable: 'code',
    messages: {
      unexpectedTranslationType: 'Unexpected translation type: {{key}}',
      unexpectedLiteralString: 'Unexpected literal string translation: {{key}}',
      missingReturnStatement: 'Missing return statement: {{key}}',
    },
  },
  create: function (context) {

    // Early return for non translation files
    if (!isTranslationFile(context)) {
      return {};
    }

    return {

      ExportNamedDeclaration (node) {

        // Early return for nodes that aren't the one exporting translations
        if (!isMainTranslationNode(node)) {
          return;
        }

        const translationProperties = getTranslationProperties(node);

        for (const tp of translationProperties) {

          const key = tp.key.value;

          if (tp.value.type === 'TemplateLiteral') {
            continue;
          }

          if (tp.value.type === 'ArrowFunctionExpression') {

            if (tp.value.body.type === 'TemplateLiteral') {
              continue;
            }
            if (tp.value.body.type === 'CallExpression') {
              continue;
            }
            if (isSanitizeTagFunction(tp.value.body)) {
              continue;
            }

            if (tp.value.body.type === 'BlockStatement') {

              const returnStatement = tp.value.body.body.find(({ type }) => type === 'ReturnStatement');

              if (returnStatement == null) {
                reportMissingReturn(context, key, tp.value.body);
                continue;
              }
              else {

                const returnArgument = returnStatement.argument;

                if (returnArgument.type === 'TemplateLiteral') {
                  continue;
                }
                if (returnArgument.type === 'CallExpression') {
                  continue;
                }
                if (returnArgument.type === 'ConditionalExpression') {
                  continue;
                }
                if (isSanitizeTagFunction(returnArgument)) {
                  continue;
                }

                report(context, key, returnArgument);
                continue;
              }
            }

            report(context, key, tp.value.body);
            continue;
          }

          report(context, key, tp.value);
        }
      },
    };
  },
};
