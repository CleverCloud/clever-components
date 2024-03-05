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
    return [markdownIndexer, ...existingIndexers]
  },
  viteFinal (config, { configType }) {
    // transform markdown files to CSF so they can be loaded by storybook
    config.plugins?.unshift(rollupMdToCsfPlugin());

    if (configType === 'DEVELOPMENT') {
      // serve and process all files instead of storybook related files only
      config.appType = 'mpa';

      // generate CEM on demand and serve it
      config.plugins?.push(generateCem());

      // add apiConfig to the smart container roots within markdown smart stories
      config.plugins?.push(injectAuthForSmartComponentsPlugin);
    }

    return config;
  }
};

export default config;
