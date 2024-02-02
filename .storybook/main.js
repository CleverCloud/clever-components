import generateCem from '../cem/generate-cem-vite-plugin.js';

/** @type {import('@storybook/web-components-vite').StorybookConfig} */
const config = {
  stories: [
    // The regular component CSF stories
    '../src/components/**/*.stories.js',
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
  viteFinal (config, { configType }) {

    if (configType === 'DEVELOPMENT') {
      // generate CEM on demand and serve it
      config.plugins?.push(generateCem());
    }

    return config;
  }
};

export default config;
