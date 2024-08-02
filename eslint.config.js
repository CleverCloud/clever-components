// @ts-nocheck
import js from '@eslint/js';
import lit from 'eslint-plugin-lit';
import litA11y from 'eslint-plugin-lit-a11y';
import importLinter from 'eslint-plugin-import-x';
import globals from 'globals';
import i18nAlwaysArrowWithSanitize from './eslint-rules/i18n-always-arrow-with-sanitize.js';
import i18nAlwaysSanitizeWithHtml from './eslint-rules/i18n-always-sanitize-with-html.js';
import i18nAlwaysTemplateLiteralSanitize from './eslint-rules/i18n-always-template-literal-sanitize.js';
import i18nNoParamlessArrow from './eslint-rules/i18n-no-paramless-arrow.js';
import i18nNoSanitizeWithoutHtml from './eslint-rules/i18n-no-sanitize-without-html.js';
import i18nOrder from './eslint-rules/i18n-order.js';
import i18nValidKey from './eslint-rules/i18n-valid-key.js';
import i18nValidValue from './eslint-rules/i18n-valid-value.js';

export default [
  js.configs.recommended,
  {
    files: ["**/**/*.test.js", "test/**/*", "test/**/*.test.js"],
    languageOptions : {
      globals: {
        ...globals.mocha,
      }
    }
  },
  {
    files: ["tasks/**/*.js", "rollup/*", "cem/**/*"],
    languageOptions : {
      globals: {
        ...globals.node,
      }
    }
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        impliedStrict: true,
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      lit,
      "lit-a11y": litA11y,
      i18n: {
        rules: {
          'order': i18nOrder,
          'always-arrow-with-sanitize': i18nAlwaysArrowWithSanitize,
          'always-sanitize-with-html': i18nAlwaysSanitizeWithHtml,
          'always-template-literal-sanitize': i18nAlwaysTemplateLiteralSanitize,
          // FIXME: this one does not work anymore+ makes eslint crash
          'no-paramless-arrow': i18nNoParamlessArrow,
          'no-sanitize-without-html': i18nNoSanitizeWithoutHtml,
          'valid-key': i18nValidKey,
          'valid-value': i18nValidValue,
        },
      },
      importLinter,
    },
    rules: {
      // custom rules
      'i18n/always-arrow-with-sanitize': 'error',
      'i18n/always-sanitize-with-html': 'error',
      'i18n/always-template-literal-sanitize': 'error',
      'i18n/no-paramless-arrow': 'error',
      'i18n/no-sanitize-without-html': 'error',
      'i18n/order': 'error',
      'i18n/valid-key': 'error',
      'i18n/valid-value': 'error',
      // other rules
      'accessor-pairs': 'off',
      'eqeqeq': ['error', 'always', { 'null': 'never' }],
      camelcase: ['error', { allow: ['_lp$'] }],
      curly: ['error', 'all'],
      'multiline-ternary': 'off',
      'no-new': 'off',
      'padded-blocks': 'off',
      'spaced-comment': ['error', 'always', { markers: ['#region', '#endregion'] }],
      'line-comment-position': ['error', { position: 'above' }],
      'importLinter/extensions': ['error', 'always'],
      'importLinter/first': ['error'],
      'importLinter/newline-after-import': ['error', { count: 1 }],
      'importLinter/no-useless-path-segments': ['error', { noUselessIndex: true }],
      // redundant role may be necessary sometimes
      'lit-a11y/accessible-emoji': 'error',
      'lit-a11y/accessible-name': 'error',
      'lit-a11y/alt-text': 'error',
      'lit-a11y/anchor-is-valid': 'error',
      'lit-a11y/aria-activedescendant-has-tabindex': 'error',
      'lit-a11y/aria-attr-valid-value': 'error',
      'lit-a11y/aria-attrs': 'error',
      'lit-a11y/aria-role': 'error',
      'lit-a11y/aria-unsupported-elements': 'error',
      'lit-a11y/autocomplete-valid': 'error',
      'lit-a11y/click-events-have-key-events': 'error',
      'lit-a11y/heading-hidden': 'error',
      'lit-a11y/iframe-title': 'error',
      'lit-a11y/img-redundant-alt': 'error',
      'lit-a11y/list': 'error',
      'lit-a11y/mouse-events-have-key-events': 'error',
      'lit-a11y/no-access-key': 'error',
      'lit-a11y/no-aria-slot': 'error',
      'lit-a11y/no-autofocus': 'error',
      'lit-a11y/no-distracting-elements': 'error',
      'lit-a11y/no-invalid-change-handler': 'error',
      'lit-a11y/no-redundant-role': 'warn',
      'lit-a11y/obj-alt': 'error',
      'lit-a11y/role-has-required-aria-attrs': 'error',
      'lit-a11y/role-supports-aria-attr': 'error',
      'lit-a11y/scope': 'error',
      'lit-a11y/tabindex-no-positive': 'error',
      'lit-a11y/valid-lang': 'error',
      'lit/attribute-value-entities': 'error',
      'lit/binding-positions': 'error',
      'lit/no-duplicate-template-bindings': 'error',
      'lit/no-invalid-escape-sequences': 'error',
      'lit/no-invalid-html': 'error',
      'lit/no-legacy-template-syntax': 'error',
      'lit/no-private-properties': 'error',
      'lit/no-template-bind': 'error',
      'lit/no-useless-template-literals': 'error',
      'lit/no-value-attribute': 'error',
    },
  },
];
