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

// This feels like a hack but with this, we get up to date CEM inside storybook's docs page
spawn('npm', ['run', 'components:docs:watch']);

const hmrI18n = {
  name: 'hmr-i18n',
  async transform (context) {

    // TODO: replace force re render with a call to LitELement requestUpdate() somehow (to keep state)
    const TRANSLATION_FILE_REGEX = /^\/src\/translations\/translations\.[a-z]+\.js$/;
    if (TRANSLATION_FILE_REGEX.test(context.path)) {
      context.body += `
        ;;
        // Injected by custom HMR for i18n
        import { addTranslations } from '../lib/i18n.js';
        import { forceReRender } from '@web/storybook-prebuilt/web-components.js';
        if (import.meta.hot) {
          import.meta.hot.accept((mod) => {
            console.log('foo');
            addTranslations(mod.lang, mod.translations);
            forceReRender();
          });
        }
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
    hmrI18n,
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
        '/node_modules/rxjs/dist/esm5/operators/index.js',
        '/node_modules/chart.js/dist/chart.esm.js',
      ],
    }),
    commonjs({
      // the commonjs plugin is slow, list the required packages explicitly:
      include: commonJsIdentifiers([
        'clipboard-copy',
        'statuses',
        // used by clever-client
        'oauth-1.0a',
        'component-emitter',
      ]),
    }),
  ],
};
