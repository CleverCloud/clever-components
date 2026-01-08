import i18nValidKey from '../../../eslint/i18n/custom-rules/i18n-valid-key.js';

export default {
  name: 'i18n-valid-key',
  rule: i18nValidKey,
  tests: {
    valid: [
      {
        name: 'valid translation keys following the pattern kebab-case.something',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-header.title': \`Some content\`,
            'cc-footer.copyright': \`Some content\`,
            'cc-button.label': \`Some content\`,
            'cc-form.input-label': \`Some content\`,
            'cc-form.error.required': \`Some content\`,
          };
        `,
      },
    ],
    invalid: [
      {
        name: 'invalid key with uppercase letters',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'CC-header.title': \`Some content\`,
          };
        `,
        errors: [
          {
            messageId: 'unexpectedTranslationKey',
            data: { key: 'CC-header.title' },
          },
        ],
      },
      {
        name: 'invalid key with missing hyphen after prefix',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc.title': \`Some content\`,
          };
        `,
        errors: [
          {
            messageId: 'unexpectedTranslationKey',
            data: { key: 'cc.title' },
          },
        ],
      },
      {
        name: 'invalid key with missing dot',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-header': \`Some content\`,
          };
        `,
        errors: [
          {
            messageId: 'unexpectedTranslationKey',
            data: { key: 'cc-header' },
          },
        ],
      },
      {
        name: 'invalid key with special characters',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-header.title!': \`Some content\`,
          };
        `,
        errors: [
          {
            messageId: 'unexpectedTranslationKey',
            data: { key: 'cc-header.title!' },
          },
        ],
      },
      {
        name: 'invalid key with underscore',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-header_title.text': \`Some content\`,
          };
        `,
        errors: [
          {
            messageId: 'unexpectedTranslationKey',
            data: { key: 'cc-header_title.text' },
          },
        ],
      },
    ],
  },
};
