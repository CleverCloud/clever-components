import i18nValidValue from '../../eslint/i18n/custom-rules/i18n-valid-value.js';

export default {
  name: 'i18n-valid-value',
  rule: i18nValidValue,
  tests: {
    valid: [
      {
        name: 'template literal',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.simple': \`Simple template literal\`,
          };
        `,
      },
      {
        name: 'call expression',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.call': someFunction('param'),
          };
        `,
      },
      {
        name: 'arrow function with template literal',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.arrow': (name) => \`Hello \${name}\`,
          };
        `,
      },
      {
        name: 'arrow function with sanitize',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.sanitize': () => sanitize\`<em>Important</em>\`,
          };
        `,
      },
      {
        name: 'arrow function with block and return template literal',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.block': (name) => {
              return \`Hello \${name}\`;
            },
          };
        `,
      },
      {
        name: 'arrow function with block and return conditional',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.conditional': (count) => {
              return count > 1 ? \`\${count} items\` : \`1 item\`;
            },
          };
        `,
      },
      {
        name: 'identifier callback',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.callback': someCallbackFunction,
          };
        `,
      },
    ],
    invalid: [
      {
        name: 'literal string',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.literal': "Simple string",
          };
        `,
        errors: [
          {
            messageId: 'unexpectedLiteralString',
            data: { key: 'cc-test.literal' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.literal': \`Simple string\`,
          };
        `,
      },
      {
        name: 'arrow function without return statement',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.no-return': () => {
              const text = 'something';
            },
          };
        `,
        errors: [
          {
            messageId: 'missingReturnStatement',
            data: { key: 'cc-test.no-return' },
          },
        ],
      },
      {
        name: 'arrow function returning literal string',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.return-literal': () => {
              return "literal string";
            },
          };
        `,
        errors: [
          {
            messageId: 'unexpectedLiteralString',
            data: { key: 'cc-test.return-literal' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.return-literal': () => {
              return \`literal string\`;
            },
          };
        `,
      },
      {
        name: 'number literal',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.number': 42,
          };
        `,
        errors: [
          {
            messageId: 'unexpectedTranslationType',
            data: { key: 'cc-test.number' },
          },
        ],
      },
      {
        name: 'object literal',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.object': { text: 'hello' },
          };
        `,
        errors: [
          {
            messageId: 'unexpectedTranslationType',
            data: { key: 'cc-test.object' },
          },
        ],
      },
      {
        name: 'regular function',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.function': function(name) { return \`Hello \${name}\`; },
          };
        `,
        errors: [
          {
            messageId: 'unexpectedTranslationType',
            data: { key: 'cc-test.function' },
          },
        ],
      },
    ],
  },
};
