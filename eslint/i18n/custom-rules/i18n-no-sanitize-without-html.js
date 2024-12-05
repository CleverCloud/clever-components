import {
  getTranslationProperties,
  isMainTranslationNode,
  isSanitizeTagFunction,
  isTranslationFile,
  parseTemplate,
} from './i18n-shared.js';

function testNode(context, key, node) {
  if (isSanitizeTagFunction(node)) {
    const { contents, hasHtml } = parseTemplate(context, node.quasi);
    if (!hasHtml) {
      report(context, key, node, contents);
    }
  }
}

function report(context, key, sanitizeTaggedTemplateNode, contents) {
  context.report({
    node: sanitizeTaggedTemplateNode,
    messageId: 'uselessSanitize',
    data: { key },
    fix: (fixer) => fixer.replaceText(sanitizeTaggedTemplateNode, `\`${contents}\``),
  });
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'prevent sanitize tag function usage when the translation string does not contain any HTML',
      category: 'Translation files',
    },
    fixable: 'code',
    messages: {
      uselessSanitize: 'Useless sanitize with HTML-less value: {{key}}',
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

          if (tp.value.type === 'ArrowFunctionExpression') {
            testNode(context, key, tp.value.body);

            if (tp.value.body.type === 'BlockStatement') {
              const returnStatement = tp.value.body.body.find(({ type }) => type === 'ReturnStatement');
              if (returnStatement != null) {
                testNode(context, key, returnStatement.argument);
              }
            }
          }
        }
      },
    };
  },
};
