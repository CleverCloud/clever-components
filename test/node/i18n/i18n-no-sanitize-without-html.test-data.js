import i18nNoSanitizeWithoutHtml from '../../../eslint/i18n/custom-rules/i18n-no-sanitize-without-html.js';

export default {
  name: 'i18n-no-sanitize-without-html',
  rule: i18nNoSanitizeWithoutHtml,
  tests: {
    valid: [
      {
        name: 'sanitize with HTML tags',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.html': () => sanitize\`<em>content with HTML</em>\`,
          };
        `,
      },
      {
        name: 'sanitize with self-closing HTML tag',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.br': () => sanitize\`Line 1<br/>Line 2\`,
          };
        `,
      },
      {
        name: 'sanitize with HTML entity',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.nbsp': () => sanitize\`Text with&nbsp;non-breaking space\`,
          };
        `,
      },
      {
        name: 'sanitize with arrow function block and HTML',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.block': () => {
              return sanitize\`<strong>Bold text</strong>\`;
            },
          };
        `,
      },
      {
        name: 'regular template literal without HTML',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.plain': \`Just plain text\`,
          };
        `,
      },
    ],
    invalid: [
      {
        name: 'sanitize with arrow function but no HTML',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.no-html': () => sanitize\`Simple text without HTML\`,
          };
        `,
        errors: [
          {
            messageId: 'uselessSanitize',
            data: { key: 'cc-test.no-html' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.no-html': () => \`Simple text without HTML\`,
          };
        `,
      },
      {
        name: 'sanitize with block return but no HTML',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.block-no-html': () => {
              return sanitize\`Just text\`;
            },
          };
        `,
        errors: [
          {
            messageId: 'uselessSanitize',
            data: { key: 'cc-test.block-no-html' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.block-no-html': () => {
              return \`Just text\`;
            },
          };
        `,
      },
      {
        name: "sanitize with text that looks like HTML but isn't",
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.fake-html': () => sanitize\`This is < than that > but not HTML\`,
          };
        `,
        errors: [
          {
            messageId: 'uselessSanitize',
            data: { key: 'cc-test.fake-html' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.fake-html': () => \`This is < than that > but not HTML\`,
          };
        `,
      },
    ],
  },
};
