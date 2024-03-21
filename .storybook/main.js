import generateCem from '../cem/generate-cem-vite-plugin.js';
import { rollupMdToCsfPlugin } from '../src/stories/lib/markdown-to-csf.js';
import { markdownIndexer } from '../src/stories/lib/markdown-indexer.js';
import { injectAuthForSmartComponentsPlugin } from '../src/stories/lib/smart-auth-plugin.js';

/** @type {import('@storybook/web-components-vite').StorybookConfig} */
const config = {
  stories: [
    // The Top level Markdown documents
    '../README.md',
    // The Markdown documents inside docs (excluding "example" components)
    '../docs/**/!(*example*).md',
    // The regular CSF stories
    '../src/**/*.stories.js',
    // The smart component Markdown docs
    '../src/**/*smart*.md',
  ],
  staticDirs: [
    {
      from: '../src/styles/default-theme.css',
      to: 'styles/default-theme.css',
    },
    {
      from: '../node_modules/highlight.js/styles/vs.css',
      to: 'styles/vs.css',
    },
    {
      from: '../node_modules/github-markdown-css/github-markdown.css',
      to: 'styles/github-markdown.css',
    },
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  docs: {
    // This makes Storybook auto-generate docs for every story with the `autodocs` tag
    // We could have set this to `true` to auto-generate docs for every story without adding any tag 
    // but this allows us to create stories with no auto-generated docs if we want to.
    autodocs: "tag",
  },
  // index markdown stories so they can be part of the generated menu and lazy loaded
  experimental_indexers: async (existingIndexers) => {
    return [markdownIndexer, ...existingIndexers ?? []]
  },
  async viteFinal (config, { configType }) {
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
        plugins: [...commonPlugins, ...devModePlugins],
      }
    }

    if (configType === 'PRODUCTION') {
      customConfig = {
        plugins: commonPlugins,
      }
    }

    return mergeConfig(config, customConfig);
  }
};

export default config;
