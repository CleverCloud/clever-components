/**
 * @import { Rule } from 'eslint'
 * @import { Identifier } from 'estree'
 */

/** @type {Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    messages: {
      unsortedProperties:
        'Properties in static get properties() should be sorted: spreads first, then alphabetical, then _-prefixed.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      MethodDefinition(node) {
        if (!node.static || node.kind !== 'get' || node.key.type !== 'Identifier' || node.key.name !== 'properties') {
          return;
        }

        const body = node.value.body.body;
        const firstStatement = body[0];
        if (
          firstStatement == null ||
          firstStatement.type !== 'ReturnStatement' ||
          firstStatement.argument?.type !== 'ObjectExpression'
        ) {
          return;
        }

        const properties = firstStatement.argument.properties;
        if (properties.length <= 1) {
          return;
        }

        // Check for unknown spread elements — bail out if found
        for (const prop of properties) {
          if (prop.type === 'SpreadElement') {
            const isSuperProperties =
              prop.argument.type === 'MemberExpression' &&
              prop.argument.object.type === 'Super' &&
              prop.argument.property.type === 'Identifier' &&
              prop.argument.property.name === 'properties';

            if (!isSuperProperties) {
              return;
            }
          }
        }

        const sorted = properties.toSorted((pA, pB) => {
          if (pA.type === 'SpreadElement') {
            return -1;
          }
          if (pB.type === 'SpreadElement') {
            return 1;
          }

          const pAName = /** @type {Identifier} */ (pA.key).name;
          const pBName = /** @type {Identifier} */ (pB.key).name;

          if (pAName.startsWith('_') && !pBName.startsWith('_')) {
            return 1;
          }
          if (pBName.startsWith('_') && !pAName.startsWith('_')) {
            return -1;
          }
          if (pAName === pBName) {
            return 0;
          }

          return pAName < pBName ? -1 : 1;
        });

        // Check if order changed
        const isSorted = properties.every((prop, i) => prop === sorted[i]);
        if (isSorted) {
          return;
        }

        context.report({
          node: firstStatement.argument,
          messageId: 'unsortedProperties',
          fix(fixer) {
            const originalTexts = properties.map((prop) => sourceCode.getText(prop));
            const sortedTexts = sorted.map((prop) => sourceCode.getText(prop));

            const fixes = [];
            for (let i = 0; i < properties.length; i++) {
              if (originalTexts[i] !== sortedTexts[i]) {
                fixes.push(fixer.replaceText(properties[i], sortedTexts[i]));
              }
            }
            return fixes;
          },
        });
      },
    };
  },
};
