import i18nAlwaysTemplateLiteralSanitize from '../../eslint-local-plugins/i18n/custom-rules/i18n-always-template-literal-sanitize.js';

export default {
  name: 'i18n-always-template-literal-sanitize',
  rule: i18nAlwaysTemplateLiteralSanitize,
  tests: {
    valid: [
      {
        name: 'sanitize as template literal tag',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.tag': sanitize\`<em>content</em>\`,
          };
        `,
      },
      {
        name: 'sanitize as template literal tag in arrow function',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.arrow': () => sanitize\`<em>content</em>\`,
          };
        `,
      },
      {
        name: 'sanitize as template literal tag in block',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.block': () => {
              return sanitize\`<em>content</em>\`;
            },
          };
        `,
      },
      {
        name: 'regular template literal (no sanitize)',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.regular': \`Simple content\`,
          };
        `,
      },
    ],
    invalid: [
      {
        name: 'sanitize as function call',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.call': sanitize(\`<em>content</em>\`),
          };
        `,
        errors: [
          {
            messageId: 'sanitizeAlwaysTemplateLiteral',
            data: { key: 'cc-test.call' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.call': sanitize\`<em>content</em>\`,
          };
        `,
      },
      {
        name: 'sanitize as function call in arrow',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.arrow-call': () => sanitize(\`<em>content</em>\`),
          };
        `,
        errors: [
          {
            messageId: 'sanitizeAlwaysTemplateLiteral',
            data: { key: 'cc-test.arrow-call' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.arrow-call': () => sanitize\`<em>content</em>\`,
          };
        `,
      },
      {
        name: 'sanitize as function call in block',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.block-call': () => {
              return sanitize(\`<em>content</em>\`);
            },
          };
        `,
        errors: [
          {
            messageId: 'sanitizeAlwaysTemplateLiteral',
            data: { key: 'cc-test.block-call' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.block-call': () => {
              return sanitize\`<em>content</em>\`;
            },
          };
        `,
      },
      {
        name: 'sanitize with multiple arguments (no auto-fix)',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.multiple-args': sanitize(\`<em>content</em>\`, 'extra'),
          };
        `,
        errors: [
          {
            messageId: 'sanitizeAlwaysTemplateLiteral',
            data: { key: 'cc-test.multiple-args' },
          },
        ],
      },
      {
        name: 'sanitize with non-template-literal argument (no auto-fix)',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.string-arg': sanitize('<em>content</em>'),
          };
        `,
        errors: [
          {
            messageId: 'sanitizeAlwaysTemplateLiteral',
            data: { key: 'cc-test.string-arg' },
          },
        ],
      },
    ],
  },
};
