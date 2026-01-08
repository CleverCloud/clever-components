import i18nNoParamlessArrow from '../../../eslint/i18n/custom-rules/i18n-no-paramless-arrow.js';

export default {
  name: 'i18n-no-paramless-arrow',
  rule: i18nNoParamlessArrow,
  tests: {
    valid: [
      {
        name: 'simple template literal without arrow',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.simple': \`Simple text\`,
          };
        `,
      },
      {
        name: 'arrow function with parameters',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.with-params': (name) => \`Hello \${name}\`,
          };
        `,
      },
      {
        name: 'arrow function with multiple parameters',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.multiple-params': (first, second) => \`\${first} and \${second}\`,
          };
        `,
      },
      {
        name: 'paramless arrow with sanitize (the only allowed exception)',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.sanitize': () => sanitize\`<em>Important</em>\`,
          };
        `,
      },
    ],
    invalid: [
      {
        name: 'paramless arrow with template literal',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.paramless': () => \`Simple text\`,
          };
        `,
        errors: [
          {
            messageId: 'paramlessArrow',
            data: { key: 'cc-test.paramless' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.paramless': \`Simple text\`,
          };
        `,
      },
      {
        name: 'paramless arrow with string concatenation',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.concat': () => \`Hello \` + \`World\`,
          };
        `,
        errors: [
          {
            messageId: 'paramlessArrow',
            data: { key: 'cc-test.concat' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.concat': \`Hello \` + \`World\`,
          };
        `,
      },
      {
        name: 'paramless arrow with function call',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.call': () => someFn(),
          };
        `,
        errors: [
          {
            messageId: 'paramlessArrow',
            data: { key: 'cc-test.call' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.call': someFn(),
          };
        `,
      },
      {
        name: 'paramless arrow with literal string',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.literal': () => "Simple text",
          };
        `,
        errors: [
          {
            messageId: 'paramlessArrow',
            data: { key: 'cc-test.literal' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.literal': "Simple text",
          };
        `,
      },
    ],
  },
};
