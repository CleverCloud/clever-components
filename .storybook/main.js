import copy from 'rollup-plugin-copy';
import generateCem from '../cem/generate-cem-vite-plugin.js';
import { markdownIndexer } from '../src/stories/lib/markdown-indexer.js';
import { rollupMdToCsfPlugin } from '../src/stories/lib/markdown-to-csf.js';
import { injectAuthForSmartComponentsPlugin } from '../src/stories/lib/smart-auth-plugin.js';

/** @type {import('@storybook/web-components-vite').StorybookConfig} */
const config = {
  stories: [
    // The Top level Markdown documents
    // '../CONTRIBUTING.md',
    // '../README.md',
    // The Markdown documents inside docs (excluding "example" components)
    // '../docs/**/!(*example*).md',
    // The regular CSF stories
    '../src/**/cc-domain-management.stories.js',
    // The smart component Markdown docs
    // '../src/**/*smart*.md',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  // index markdown stories so they can be part of the generated menu and lazy loaded
  // eslint-disable-next-line camelcase
  experimental_indexers: async (existingIndexers) => {
    return [markdownIndexer, ...(existingIndexers ?? [])];
  },
  async viteFinal(config, { configType }) {
    // This dynamic import is the recommended Storybook way to
    // import `vite`. With a static import you get a warning about CJS.
    // see: https://storybook.js.org/docs/builders/vite#configuration
    const { mergeConfig } = await import('vite');
    /** @type {import('vite').InlineConfig} **/
    let customConfig = {};

    const commonPlugins = [rollupMdToCsfPlugin()];

    const devModePlugins = [
      // generate CEM on demand and serve it
      generateCem(),
      // add apiConfig to the smart container roots within markdown smart stories
      injectAuthForSmartComponentsPlugin,
    ];

    if (configType === 'DEVELOPMENT') {
      customConfig = {
        // serve and process all files instead of storybook related files only
        appType: 'mpa',
        resolve: {
          alias: [
            {
              // Without this, vite resolves our imports to the actual `custom-elements.json` file
              // inside the `dist` folder.
              // We need to rely on a virtual file in dev mode, see the `generateCem` plugin for more info.
              find: /.*\/dist\/custom-elements\.json$/,
              replacement: 'virtual:custom-elements.json',
            },
          ],
        },
        plugins: [...commonPlugins, ...devModePlugins],
      };
    }

    if (configType === 'PRODUCTION') {
      customConfig = {
        plugins: [
          ...commonPlugins,
          // The clever cloud Storybook static app needs a `.htaccess` at the root of `storybook-static`
          // @ts-expect-error type error related to the plugin but our usage matches the docs
          copy({
            targets: [
              {
                src: `.storybook/.htaccess`,
                dest: config.build.outDir,
              },
            ],
          }),
        ],
      };
    }

    return mergeConfig(config, customConfig);
  },
};

export default config;
