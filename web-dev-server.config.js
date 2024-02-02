import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';
import json from '@rollup/plugin-json';
import { fromRollup, rollupAdapter } from '@web/dev-server-rollup';
import { storybookWdsPlugin } from './src/stories/lib/markdown.cjs';
import { cemAnalyzerPlugin } from './wds/cem-analyzer-plugin.js';
import { commonjsPluginWithConfig, esbuildBundlePluginWithConfig } from './wds/wds-common.js';

const hmrI18nPlugin = {
  name: 'hmr-i18n',
  async transform (context) {

    // TODO: replace force re render with a call to LitELement requestUpdate() somehow (to keep state)
    const TRANSLATION_FILE_REGEX = /^\/src\/translations\/translations\.[a-z]+\.js$/;
    if (TRANSLATION_FILE_REGEX.test(context.path)) {
      // language=JavaScript
      context.body += `
        ;;
        // Injected by custom HMR for i18n
        import { addTranslations } from '../lib/i18n.js';
        import { forceReRender } from '@web/storybook-prebuilt/web-components.js';

        if (import.meta.hot) {
          import.meta.hot.accept((mod) => {

            // Let's add the new translations
            addTranslations(mod.lang, mod.translations);

            // We're going to assume we will need a to force storybook to re-render
            let needStorybookForceRerender = true;

            // Let's find all our LitElement base custom elements in the story
            // and force requestUpdate() on all their properties
            const customElements = Array
              .from(
                document
                  .querySelector('.story-shadow-container')
                  .shadowRoot
                  .querySelectorAll(':defined')
              )
              .forEach((el) => {
                if (el.requestUpdate != null) {
                  const properties = Object.keys(el.constructor.properties);
                  for (const prop of properties) {
                    el.requestUpdate(prop);
                  }
                  // Seems like it's a LitElement custom element, we won't need the Storybook force rerender
                  needStorybookForceRerender = false;
                }
              });

            if (needStorybookForceRerender) {
              forceReRender();
            }
          });
        }
      `;
    }
  },
};

const injectAuthForSmartComponentsPlugin = {
  name: 'inject-auth-for-smart-components',
  async transform (context) {

    const {
      WARP_10_HOST,
      API_HOST,
      API_OAUTH_TOKEN,
      API_OAUTH_TOKEN_SECRET,
      OAUTH_CONSUMER_KEY,
      OAUTH_CONSUMER_SECRET,
    } = process.env;

    const SMART_COMPONENT_STORY_REGEX = /^\/src\/components\/.*\/cc-.*\.smart.*\.md$/;
    if (SMART_COMPONENT_STORY_REGEX.test(context.path)) {

      // language=JavaScript
      context.body += `
        import { updateRootContext } from '../../lib/smart-manager.js';

        updateRootContext({
          apiConfig: {
            WARP_10_HOST: '${WARP_10_HOST}',
            API_HOST: '${API_HOST}',
            API_OAUTH_TOKEN: '${API_OAUTH_TOKEN}',
            API_OAUTH_TOKEN_SECRET: '${API_OAUTH_TOKEN_SECRET}',
            OAUTH_CONSUMER_KEY: '${OAUTH_CONSUMER_KEY}',
            OAUTH_CONSUMER_SECRET: '${OAUTH_CONSUMER_SECRET}',
          },
        });
      `;
    }

    if (context.path === '/demo-smart/index.js') {

      // language=JavaScript
      context.body += `
        updateRootContext({
          apiConfig: {
            WARP_10_HOST: '${WARP_10_HOST}',
            API_HOST: '${API_HOST}',
            API_OAUTH_TOKEN: '${API_OAUTH_TOKEN}',
            API_OAUTH_TOKEN_SECRET: '${API_OAUTH_TOKEN_SECRET}',
            OAUTH_CONSUMER_KEY: '${OAUTH_CONSUMER_KEY}',
            OAUTH_CONSUMER_SECRET: '${OAUTH_CONSUMER_SECRET}',
          },
        });
      `;
    }
  },
};

export default {
  port: 6006,
  // There is a PR to include this in the default config of Web Dev Server (https://github.com/modernweb-dev/web/pull/2109)
  // Once it's merged, we may revert this part of the config to `nodeResolve: true`
  nodeResolve: true,
  // watch: true,
  mimeTypes: {
    '**/*.md': 'js',
    '**/*.json': 'js',
    '.**/*.json': 'js',
  },
  plugins: [
    storybookWdsPlugin(),
    hmrI18nPlugin,
    injectAuthForSmartComponentsPlugin,
    cemAnalyzerPlugin,
    hmrPlugin({
      include: ['src/**/*'],
      presets: [presets.lit],
    }),
    rollupAdapter(json()),
    esbuildBundlePluginWithConfig,
    commonjsPluginWithConfig,
  ],
};
