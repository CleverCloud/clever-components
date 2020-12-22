const json = require('@rollup/plugin-json');
const commonjs = require('@rollup/plugin-commonjs');
const { storybookRollupPlugin } = require('../stories/lib/markdown.cjs');

module.exports = {
  stories: [
    // Top level Markdown documents
    '../*.md',
    // Then Markdown documents inside docs
    '../docs/**/*.md',
    // Then regular CSF stories
    '../stories/**/*.stories.js',
  ],
  rollupConfig (config) {

    // Replace Modern Web plugin MD support with plain markdown support
    config.plugins = config.plugins.filter((plugin) => plugin.name !== 'md');
    config.plugins.unshift(storybookRollupPlugin());

    config.plugins.unshift(json());
    config.plugins.unshift(commonjs());

    return config;
  },
};
