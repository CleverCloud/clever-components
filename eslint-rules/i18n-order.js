'use strict';

const { isTranslationFile, isMainTranslationNode, getTranslationProperties } = require('./i18n-shared.js');

function getPrefix(key) {
  return key.split('.')[0];
}

module.exports = {
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

        const sourceCode = context.getSourceCode();

        // Identify empty lines inside the translations so we can remove them
        const emptyLines = sourceCode.lines
          // Only lines inside the translations node
          .slice(node.loc.start.line, node.loc.end.line - 1)
          .map((line, index) => {
            if (line.trim() === '') {
              const lineIndex = index + node.loc.start.line + 1;
              const rangeStart = sourceCode.getIndexFromLoc({ line: lineIndex, column: 0 });
              const rangeEnd = sourceCode.getIndexFromLoc({ line: lineIndex + 1, column: 0 });
              return { rangeStart, rangeEnd };
            }
            return null;
          })
          .filter((a) => a != null);

        const keysToNode = {};

        // Identify translation comments so we can remove them (they will be recreated after words
        const translationComments = sourceCode.ast.comments.filter((commentNode) => {
          return (
            commentNode.type === 'Line' &&
            node.loc.start.line < commentNode.loc.start.line &&
            commentNode.loc.end.line < node.loc.end.line
          );
        });

        getTranslationProperties(node).forEach((tpNode) => {
          keysToNode[tpNode.key.value] = tpNode;
        });

        const translationKeys = Object.keys(keysToNode);
        const sortedTranslationKeys = [...translationKeys].sort((a, b) => {
          const aPrefix = getPrefix(a);
          const bPrefix = getPrefix(b);
          // Make sure we sort by prefix before sorting by the rest of the key
          return aPrefix !== bPrefix ? aPrefix.localeCompare(bPrefix) : a.localeCompare(b);
        });

        if (JSON.stringify(translationKeys) !== JSON.stringify(sortedTranslationKeys)) {
          const firstNodes = {};

          const fixes = translationKeys
            .map((oldKey, index) => {
              const oldNode = keysToNode[oldKey];
              const newKey = sortedTranslationKeys[index];
              const newNode = keysToNode[newKey];

              // Add +1 at the end of the range for the trailing comma
              const oldRange = [oldNode.range[0], oldNode.range[1] + 1];
              const newText = sourceCode.text.substring(newNode.start, newNode.end + 1);

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
              return [
                // Remove empty lines
                ...emptyLines.flatMap(({ rangeStart, rangeEnd }) => fixer.removeRange([rangeStart, rangeEnd])),

                // Remove translation comments
                ...translationComments.flatMap((cmtNode) =>
                  fixer.removeRange([cmtNode.range[0], cmtNode.range[1] + 1]),
                ),

                // Sort translations (and insert fold region comments)
                ...fixes.flatMap(({ oldRange, newText, isFirstNode, isLastNode, prefix }) => {
                  return [
                    isFirstNode ? fixer.insertTextBeforeRange(oldRange, `  //#region ${prefix}\n`) : null,
                    fixer.replaceTextRange(oldRange, newText),
                    isLastNode ? fixer.insertTextAfterRange(oldRange, `\n  //#endregion`) : null,
                  ].filter((a) => a != null);
                }),
              ];
            },
          });
        }
      },
    };
  },
};
