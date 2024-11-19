// i18n-always-sanitize-with-html.test.mjs
import i18nAlwaysSanitizeWithHtml from '../../eslint-local-plugins/i18n/custom-rules/i18n-always-sanitize-with-html.js';

export default {
  name: 'i18n-always-sanitize-with-html',
  rule: i18nAlwaysSanitizeWithHtml,
  tests: {
    valid: [
      {
        name: 'no HTML, no sanitize needed',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.simple': \`Simple text without HTML\`,
          };
        `,
      },
      {
        name: 'HTML with sanitize',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.html': sanitize\`<em>content with HTML</em>\`,
          };
        `,
      },
      {
        name: 'HTML with sanitize in arrow function',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.arrow': () => sanitize\`<strong>important</strong>\`,
          };
        `,
      },
      {
        name: 'HTML with sanitize in block',
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
        name: 'non-breaking space with sanitize',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.nbsp': sanitize\`Text with&nbsp;space\`,
          };
        `,
      },
    ],
    invalid: [
      {
        name: 'HTML without sanitize',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.unsafe': \`<em>Unsafe HTML</em>\`,
          };
        `,
        errors: [
          {
            messageId: 'unsafeHtmlValue',
            data: { key: 'cc-test.unsafe' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.unsafe': sanitize\`<em>Unsafe HTML</em>\`,
          };
        `,
      },
      {
        name: 'self-closing tag without sanitize',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.br': \`Line 1<br/>Line 2\`,
          };
        `,
        errors: [
          {
            messageId: 'unsafeHtmlValue',
            data: { key: 'cc-test.br' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.br': sanitize\`Line 1<br/>Line 2\`,
          };
        `,
      },
      {
        name: 'HTML without sanitize in arrow function',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.arrow-unsafe': () => \`<strong>unsafe</strong>\`,
          };
        `,
        errors: [
          {
            messageId: 'unsafeHtmlValue',
            data: { key: 'cc-test.arrow-unsafe' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.arrow-unsafe': () => sanitize\`<strong>unsafe</strong>\`,
          };
        `,
      },
      {
        name: 'HTML without sanitize in block',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.block-unsafe': () => {
              return \`<em>unsafe</em>\`;
            },
          };
        `,
        errors: [
          {
            messageId: 'unsafeHtmlValue',
            data: { key: 'cc-test.block-unsafe' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.block-unsafe': () => {
              return sanitize\`<em>unsafe</em>\`;
            },
          };
        `,
      },
      {
        name: 'non-breaking space without sanitize',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.unsafe-nbsp': \`Text with&nbsp;space\`,
          };
        `,
        errors: [
          {
            messageId: 'unsafeHtmlValue',
            data: { key: 'cc-test.unsafe-nbsp' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.unsafe-nbsp': sanitize\`Text with&nbsp;space\`,
          };
        `,
      },
    ],
  },
};
