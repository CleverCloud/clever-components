import eslintLitA11yPlugin from 'eslint-plugin-lit-a11y';

export default {
  name: 'lit-a11y-cc',
  files: ['**/*.js'],
  plugins: {
    'lit-a11y': eslintLitA11yPlugin,
  },
  rules: {
    ...eslintLitA11yPlugin.configs.recommended.rules,
    // redundant role may be necessary sometimes
    'lit-a11y/no-redundant-role': 'warn',
  },
};
