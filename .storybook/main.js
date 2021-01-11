const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const { importMetaAssets } = require('@web/rollup-plugin-import-meta-assets');
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

    // Detect and copy assets
    config.output.assetFileNames = 'assets/[name].[ext]';
    config.plugins.unshift(importMetaAssets({
      // Let's assume we don't have import.meta.url assets in our deps to speed up things
      exclude: 'node_modules/**',
    }));

    // Replace Modern Web plugin MD support with plain markdown support
    config.plugins = config.plugins.filter((plugin) => plugin.name !== 'md');
    config.plugins.unshift(storybookRollupPlugin());

    // This babel config contains HTML/CSS minification
    // it also contains a config to replace old JS (before 3 latest browser version) and it breaks some stuffs with import.meta.url
    config.plugins = config.plugins.filter((plugin) => plugin.name !== 'babel');

    // We don't want any polyfill
    config.plugins = config.plugins.filter((plugin) => plugin.name !== '@web/rollup-plugin-polyfills-loader');

    // We just want ESM
    config.output.format = 'es';

    config.plugins.unshift(json());
    config.plugins.unshift(commonjs());

    return config;
  },
};
