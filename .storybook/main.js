const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // We don't use this yet because of HMR
  // stories: ['../**/*.stories.js'],
  // The order of those imports will be the same as the order of tabs in addons pane
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-notes/register',
    '@storybook/addon-viewport/register',
  ],
  presets: ['@storybook/addon-docs/preset'],
  webpackFinal: (config) => {

    // Copy all svg so our usage with `import.meta.url` still work
    config.plugins.push(new CopyWebpackPlugin(['src/assets/*.svg']));

    return config;
  },
};
