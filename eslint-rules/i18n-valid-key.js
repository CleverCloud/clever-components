'use strict';

const { isTranslationFile, isMainTranslationNode, getTranslationProperties } = require('./i18n-shared.js');

const VALID_TRANSLATION_KEY = /^[a-z]+-[a-z][a-z-]*\.[a-z0-9-.]+$/;

function report (context, key, node) {
  context.report({
    node,
    messageId: 'unexpectedTranslationKey',
    data: { key },
  });
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce naming pattern on translation keys',
      category: 'Translation files',
    },
    fixable: 'code',
    messages: {
      unexpectedTranslationKey: 'Unexpected translation key pattern: {{key}}',
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

          if (key == null || !key.match(VALID_TRANSLATION_KEY)) {
            report(context, key, tp.key);
          }
        }
      },
    };
  },
};
