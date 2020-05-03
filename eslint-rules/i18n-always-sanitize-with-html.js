'use strict';

const {
  isTranslationFile,
  isMainTranslationNode,
  getTranslationProperties,
  parseTemplate,
} = require('./i18n-shared.js');

function testNode (context, key, templateLiteralNode) {
  if (templateLiteralNode.type === 'TemplateLiteral') {
    const { contents, hasHtml } = parseTemplate(context, templateLiteralNode);
    if (hasHtml) {
      report(context, key, templateLiteralNode, contents);
    }
  }
}

function report (context, key, templateLiteralNode, contents) {
  context.report({
    node: templateLiteralNode,
    messageId: 'unsafeHtmlValue',
    data: { key },
    fix: (fixer) => fixer.replaceText(templateLiteralNode, `sanitize\`${contents}\``),
  });
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce sanitize tag function when the translation string contains HTML',
      category: 'Translation files',
    },
    fixable: 'code',
    messages: {
      unsafeHtmlValue: 'Unsafe use of HTML in template literal value: {{key}}',
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

          testNode(context, key, tp.value);

          if (tp.value.type === 'ArrowFunctionExpression') {

            testNode(context, key, tp.value.body);

            if (tp.value.body.type === 'BlockStatement') {
              const returnStatement = tp.value.body.body.find(({ type }) => type === 'ReturnStatement');
              if (returnStatement != null) {
                const returnArgument = returnStatement.argument;
                testNode(context, key, returnArgument);
              }
            }
          }
        }
      },
    };
  },
};
