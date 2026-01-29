import { getTranslationProperties, isMainTranslationNode, isTranslationFile } from './i18n-shared.js';

function getPrefix(key) {
  return key.split('.')[0];
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce sort order of translation keys',
      category: 'Translation files',
    },
    fixable: 'code',
    messages: {
      badTranslationKeysSortOrder: 'Bad sort order of translation keys',
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

        const sourceCode = context.sourceCode;

        const keysToNode = {};

        getTranslationProperties(node).forEach((tpNode) => {
          keysToNode[tpNode.key.value] = tpNode;
        });

        const translationKeys = Object.keys(keysToNode);
        const sortedTranslationKeys = translationKeys.toSorted((a, b) => {
          const aPrefix = getPrefix(a);
          const bPrefix = getPrefix(b);
          // Make sure we sort by prefix before sorting by the rest of the key
          return aPrefix !== bPrefix ? aPrefix.localeCompare(bPrefix) : a.localeCompare(b);
        });

        if (JSON.stringify(translationKeys) !== JSON.stringify(sortedTranslationKeys)) {
          /** @type {Record<string, Pars>} */
          const firstNodes = {};

          const fixes = translationKeys
            .map((oldKey, index) => {
              const oldNode = keysToNode[oldKey];
              const newKey = sortedTranslationKeys[index];
              const newNode = keysToNode[newKey];

              // Add +1 at the end of the range for the trailing comma
              const oldRange = [oldNode.range[0], oldNode.range[1] + 1];
              const newText = sourceCode.text.substring(newNode.range[0], newNode.range[1] + 1);

              const prefix = getPrefix(newKey);
              const isFirstNode = firstNodes[prefix] == null;
              if (isFirstNode) {
                firstNodes[prefix] = oldRange;
              }

              return { oldRange, newText, isFirstNode, prefix };
            })
            .map((item, index, allItems) => {
              const isLastNode = index === allItems.length - 1 || allItems[index + 1].isFirstNode;
              return { ...item, isLastNode };
            });

          context.report({
            node,
            messageId: 'badTranslationKeysSortOrder',
            fix: (fixer) => {
              // Line numbers start with 1 but `sourceCode.lines` is an array starting with index 0 so if
              // we want the first line, we need the [0] instead of [1]
              const translationObjectIndent = sourceCode.lines[node.loc.start.line - 1].match(/^\s*/)?.[0] ?? '';
              const translationPropertyIndent = sourceCode.lines[node.loc.start.line].match(/^\s*/)?.[0] ?? '';

              // Concatenate all fixes into a single one so that we can set the proper baseIndent
              // Rules are re-run for every single fix returned so if we return several fixes (one for each translation node + removed comment)
              // this breaks indentation because all subsequent fixes add new indentation levels
              const orderedTranslations = fixes
                .map(({ newText, isFirstNode, isLastNode, prefix }) => {
                  let result = '';
                  if (isFirstNode) {
                    result += `${translationPropertyIndent}//#region ${prefix}\n`;
                  }
                  result += `${translationPropertyIndent}${newText}`;
                  if (isLastNode) {
                    result += `\n${translationPropertyIndent}//#endregion`;
                  }
                  return result;
                })
                .join('\n');
              const objectBodyWithOrderedTranslations = `{\n${orderedTranslations}\n${translationObjectIndent}}`;

              return fixer.replaceText(node.declaration.declarations[0].init, objectBodyWithOrderedTranslations);
            },
          });
        }
      },
    };
  },
};
