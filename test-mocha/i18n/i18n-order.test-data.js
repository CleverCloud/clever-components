import i18nOrder from '../../eslint-local-plugins/i18n/custom-rules/i18n-order.js';

export default {
  name: 'i18n-order',
  rule: i18nOrder,
  tests: {
    valid: [
      {
        name: 'alphabetical order with regions',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            //#region cc-xxx
            'cc-xxx.title': \`XXX Title\`,
            //#endregion
            //#region cc-yyy
            'cc-yyy.title': \`YYY Title\`,
            //#endregion
            //#region cc-zzz
            'cc-zzz.title': \`ZZZ Title\`,
            //#endregion
          };
        `,
      },
      {
        name: 'alphabetical order within same prefix',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            //#region cc-test
            'cc-test.xxx': \`XXX\`,
            'cc-test.yyy': \`YYY\`,
            'cc-test.zzz': \`ZZZ\`,
            //#endregion
          };
        `,
      },
      {
        name: 'alphabetical prefixes and subkeys',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            //#region cc-aaa
            'cc-aaa.111': \`AAA 111\`,
            'cc-aaa.222': \`AAA 222\`,
            //#endregion
            //#region cc-bbb
            'cc-bbb.111': \`BBB 111\`,
            'cc-bbb.222': \`BBB 222\`,
            //#endregion
          };
        `,
      },
      {
        name: 'mixed content types in alphabetical order',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            //#region cc-xxx
            'cc-xxx.simple': \`XXX\`,
            //#endregion
            //#region cc-yyy
            'cc-yyy.html': sanitize\`<strong>YYY</strong>\`,
            //#endregion
            //#region cc-zzz
            'cc-zzz.complex': () => sanitize\`<em>ZZZ</em>\`,
            //#endregion
          };
        `,
      },
    ],
    invalid: [
      {
        name: 'wrong prefix order and missing regions',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-zzz.title': \`ZZZ Title\`,
            'cc-xxx.title': \`XXX Title\`,
            'cc-yyy.title': \`YYY Title\`,
          };
        `,
        errors: [
          {
            messageId: 'badTranslationKeysSortOrder',
          },
        ],
        output: `
          export const translations = {
            //#region cc-xxx
            'cc-xxx.title': \`XXX Title\`,
            //#endregion
            //#region cc-yyy
            'cc-yyy.title': \`YYY Title\`,
            //#endregion
            //#region cc-zzz
            'cc-zzz.title': \`ZZZ Title\`,
            //#endregion
          };
        `,
      },
      {
        name: 'wrong order within same prefix and missing regions',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-test.zzz': \`ZZZ\`,
            'cc-test.xxx': \`XXX\`,
            'cc-test.yyy': \`YYY\`,
          };
        `,
        errors: [
          {
            messageId: 'badTranslationKeysSortOrder',
          },
        ],
        output: `
          export const translations = {
            //#region cc-test
            'cc-test.xxx': \`XXX\`,
            'cc-test.yyy': \`YYY\`,
            'cc-test.zzz': \`ZZZ\`,
            //#endregion
          };
        `,
      },
      {
        name: 'mixed up prefixes and subkeys and missing regions',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            'cc-bbb.222': \`BBB 222\`,
            'cc-aaa.111': \`AAA 111\`,
            'cc-bbb.111': \`BBB 111\`,
            'cc-aaa.222': \`AAA 222\`,
          };
        `,
        errors: [
          {
            messageId: 'badTranslationKeysSortOrder',
          },
        ],
        output: `
          export const translations = {
            //#region cc-aaa
            'cc-aaa.111': \`AAA 111\`,
            'cc-aaa.222': \`AAA 222\`,
            //#endregion
            //#region cc-bbb
            'cc-bbb.111': \`BBB 111\`,
            'cc-bbb.222': \`BBB 222\`,
            //#endregion
          };
        `,
      },
      {
        name: 'mixed content types with wrong alphabetical order and missing regions',
        filename: '/translations/translations.fake.js',
        code: `
          export const translations = {
            //#region cc-zzz
            'cc-zzz.complex': () => {
              return sanitize\`<em>ZZZ</em>\`;
            },
            //#endregion
            //#region cc-xxx
            'cc-xxx.simple': \`XXX\`,
            //#endregion
            //#region cc-yyy
            'cc-yyy.html': sanitize\`<strong>YYY</strong>\`,
            //#endregion
          };
        `,
        errors: [
          {
            messageId: 'badTranslationKeysSortOrder',
          },
        ],
        output: `
          export const translations = {
            //#region cc-xxx
            'cc-xxx.simple': \`XXX\`,
            //#endregion
            //#region cc-yyy
            'cc-yyy.html': sanitize\`<strong>YYY</strong>\`,
            //#endregion
            //#region cc-zzz
            'cc-zzz.complex': () => {
              return sanitize\`<em>ZZZ</em>\`;
            },
            //#endregion
          };
        `,
      },
    ],
  },
};
