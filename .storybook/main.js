module.exports = {
  // We don't use this yet because of HMR
  // stories: ['../**/*.stories.js'],
  // The order of those imports will be the same as the order of tabs in addons pane
  addons: [
    // '@storybook/addon-docs/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-notes/register',
  ],
};
