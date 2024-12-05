import wcPlugin from 'eslint-plugin-wc';

export default {
  name: 'wc-cc',
  files: ['**/*.js'],
  plugins: {
    wc: wcPlugin,
  },
  settings: {
    wc: {
      elementBaseClasses: ['LitElement'],
    },
  },
  rules: {
    'wc/no-constructor-attributes': 'error',
    'wc/no-invalid-element-name': 'error',
    'wc/no-self-class': 'error',
    'wc/attach-shadow-constructor': 'error',
    'wc/guard-super-call': 'off',
    'wc/no-child-traversal-in-attributechangedcallback': 'error',
    'wc/no-child-traversal-in-connectedcallback': 'error',
    'wc/no-closed-shadow-root': 'error',
    'wc/no-constructor-params': 'error',
    'wc/no-customized-built-in-elements': 'error',
    'wc/no-invalid-extends': 'error',
    'wc/no-typos': 'error',
    'wc/require-listener-teardown': 'error',
    'wc/define-tag-after-class-definition': 'error',
    'wc/expose-class-on-global': 'off',
    'wc/file-name-matches-element': 'error',
    'wc/guard-define-call': 'off',
    'wc/max-elements-per-file': 'error',
    'wc/no-constructor': 'off',
    'wc/no-exports-with-element': 'off',
    'wc/no-method-prefixed-with-on': 'error',
    'wc/tag-name-matches-class': 'error',
  },
};
