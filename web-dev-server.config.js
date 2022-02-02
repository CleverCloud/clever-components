import { spawn } from 'child_process';
import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';
import rollupCommonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { fromRollup, rollupAdapter } from '@web/dev-server-rollup';
import { storybookWdsPlugin } from './stories/lib/markdown.cjs';
import { esbuildBundlePlugin } from './wds/esbuild-bundle-plugin.js';

const commonjs = fromRollup(rollupCommonjs);

function commonJsIdentifiers (ids) {
  return ids.map((id) => `**/node_modules/${id}/**/*`);
}

if (process.env.CC_NO_DOCS_WATCH !== 'true') {
  // This feels like a hack but with this, we get up to date CEM inside storybook's docs page
  spawn('npm', ['run', 'components:docs:watch']);
}

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
            addTranslations(mod.lang, mod.translations);
            forceReRender();
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
      API_HOST,
      API_OAUTH_TOKEN,
      API_OAUTH_TOKEN_SECRET,
      OAUTH_CONSUMER_KEY,
      OAUTH_CONSUMER_SECRET,
    } = process.env;

    const SMART_COMPONENT_STORY_REGEX = /^\/stories\/.*\/cc-.*\.smart.*\.md$/;
    if (SMART_COMPONENT_STORY_REGEX.test(context.path)) {

      // language=JavaScript
      context.body += `
        import { updateRootContext } from '../../src/lib/smart-manager.js';

        updateRootContext({
          apiConfig: {
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
    hmrPlugin({
      include: ['src/**/*'],
      presets: [presets.litElement],
      // TODO maybe hook the translation system with HMR
    }),
    rollupAdapter(json()),
    esbuildBundlePlugin({
      pathsToBundle: [
        '/src/lib/leaflet-esm.js',
        '/node_modules/rxjs/dist/esm5/index.js',
        '/node_modules/chart.js/dist/chart.esm.js',
      ],
    }),
    commonjs({
      // the commonjs plugin is slow, list the required packages explicitly:
      include: commonJsIdentifiers([
        'statuses',
        // used by clever-client
        'oauth-1.0a',
        'component-emitter',
      ]),
    }),
  ],
};
