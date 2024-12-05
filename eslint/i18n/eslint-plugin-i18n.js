import i18nAlwaysArrowWithSanitize from './custom-rules/i18n-always-arrow-with-sanitize.js';
import i18nAlwaysSanitizeWithHtml from './custom-rules/i18n-always-sanitize-with-html.js';
import i18nAlwaysTemplateLiteralSanitize from './custom-rules/i18n-always-template-literal-sanitize.js';
import i18nNoParamlessArrow from './custom-rules/i18n-no-paramless-arrow.js';
import i18nNoSanitizeWithoutHtml from './custom-rules/i18n-no-sanitize-without-html.js';
import i18nOrder from './custom-rules/i18n-order.js';
import i18nValidKey from './custom-rules/i18n-valid-key.js';
import i18nValidValue from './custom-rules/i18n-valid-value.js';

const i18nPlugin = {
  meta: {
    name: 'clever-cloud-i18n',
    version: '0.1.0',
  },
  configs: {},
  rules: {
    order: i18nOrder,
    'always-arrow-with-sanitize': i18nAlwaysArrowWithSanitize,
    'always-sanitize-with-html': i18nAlwaysSanitizeWithHtml,
    'always-template-literal-sanitize': i18nAlwaysTemplateLiteralSanitize,
    'no-paramless-arrow': i18nNoParamlessArrow,
    'no-sanitize-without-html': i18nNoSanitizeWithoutHtml,
    'valid-key': i18nValidKey,
    'valid-value': i18nValidValue,
  },
};

Object.assign(i18nPlugin.configs, {
  recommended: {
    name: 'i18n',
    files: ['**/translations.*.js'],
    plugins: {
      i18n: i18nPlugin,
    },
    rules: {
      'i18n/always-arrow-with-sanitize': 'error',
      'i18n/always-sanitize-with-html': 'error',
      'i18n/always-template-literal-sanitize': 'error',
      'i18n/no-paramless-arrow': 'error',
      'i18n/no-sanitize-without-html': 'error',
      'i18n/order': 'error',
      'i18n/valid-key': 'error',
      'i18n/valid-value': 'error',
    },
  },
});

export default i18nPlugin;
