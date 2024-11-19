import {
  getTranslationProperties,
  isMainTranslationNode,
  isSanitizeTagFunction,
  isTranslationFile,
} from './i18n-shared.js';

function report(context, key, sanitizeTaggedTemplateNode) {
  context.report({
    node: sanitizeTaggedTemplateNode,
    messageId: 'sanitizeWithoutArrow',
    data: { key },
    fix: (fixer) => fixer.insertTextBefore(sanitizeTaggedTemplateNode, '() => '),
  });
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce arrow function when using the sanitize tag function',
      category: 'Translation files',
    },
    fixable: 'code',
    messages: {
      sanitizeWithoutArrow: 'Missing arrow function with sanitize tag function: {{key}}',
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

          if (isSanitizeTagFunction(tp.value)) {
            report(context, key, tp.value);
          }
        }
      },
    };
  },
};
