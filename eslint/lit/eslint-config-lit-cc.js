import litPlugin from 'eslint-plugin-lit';
import litCleverCloudPlugin from './eslint-plugin-lit-cc.js';

export default {
  name: 'lit-cc',
  files: ['**/*.js'],
  plugins: {
    lit: litPlugin,
    'lit-cc': litCleverCloudPlugin,
  },
  rules: {
    ...litPlugin.configs['flat/recommended'].rules,
    'lit-cc/sort-get-properties': 'error',
    'lit/attribute-names': 'error',
    'lit/lifecycle-super': 'error',
    'lit/ban-attributes': ['error', 'checked'],
    'lit/no-classfield-shadowing': 'error',
    'lit/no-invalid-escape-sequences': 'error',
    'lit/no-legacy-imports': 'error',
    'lit/no-legacy-template-syntax': 'error',
    'lit/no-native-attributes': 'error',
    'lit/no-private-properties': ['error', { private: '^[_$]' }],
    'lit/no-property-change-update': 'error',
    'lit/no-template-bind': 'error',
    'lit/no-this-assign-in-render': 'error',
    'lit/no-useless-template-literals': 'error',
    'lit/no-value-attribute': 'error',
    'lit/prefer-static-styles': 'error',
    'lit/value-after-constraints': 'error',
  },
};
