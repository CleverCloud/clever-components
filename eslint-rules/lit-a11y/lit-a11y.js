import litA11y from 'eslint-plugin-lit-a11y';

const plugin = {
  meta: {
    name: 'lit-a11y',
  },
  rules: litA11y.rules,
  configs: {},
};

Object.assign(plugin.configs, {
  recommended: {
    plugins: {
      'lit-a11y': plugin,
    },
    rules: {
      ...litA11y.configs.recommended.rules,
      // redundant role may be necessary sometimes
      'lit-a11y/no-redundant-role': 'warn',
    },
  },
});

export default plugin;
