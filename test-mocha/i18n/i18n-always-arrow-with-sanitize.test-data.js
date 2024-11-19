import i18nAlwaysArrowWithSanitize from '../../eslint-local-plugins/i18n/custom-rules/i18n-always-arrow-with-sanitize.js';

export default {
  name: 'i18n-always-arrow-with-sanitize',
  rule: i18nAlwaysArrowWithSanitize,
  tests: {
    valid: [
      {
        name: 'sanitize with arrow function',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.arrow': () => sanitize\`<em>content</em>\`,
          };
        `,
      },
      {
        name: 'sanitize with arrow function in block',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.block': () => {
              return sanitize\`<strong>content</strong>\`;
            },
          };
        `,
      },
      {
        name: 'regular template literal without sanitize',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.simple': \`Just text\`,
          };
        `,
      },
      {
        name: 'arrow function without sanitize',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.arrow-simple': () => \`Hello \${name}\`,
          };
        `,
      },
    ],
    invalid: [
      {
        name: 'sanitize without arrow function',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.direct': sanitize\`<em>content</em>\`,
          };
        `,
        errors: [
          {
            messageId: 'sanitizeWithoutArrow',
            data: { key: 'cc-test.direct' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.direct': () => sanitize\`<em>content</em>\`,
          };
        `,
      },
      {
        name: 'sanitize without arrow in multiline',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.multiline': sanitize\`
              <div>
                <em>content</em>
              </div>
            \`,
          };
        `,
        errors: [
          {
            messageId: 'sanitizeWithoutArrow',
            data: { key: 'cc-test.multiline' },
          },
        ],
        output: `
          export const translations = {
            'cc-test.multiline': () => sanitize\`
              <div>
                <em>content</em>
              </div>
            \`,
          };
        `,
      },
    ],
  },
};
