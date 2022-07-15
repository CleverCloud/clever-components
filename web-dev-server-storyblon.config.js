import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';
import { generateCustomElementsManifest } from './tasks/cem-analyzer.js';

// This plugin generates and serves the CEM on demand.
const cemAnalyzerPlugin = {
  name: 'cem-analyzer-plugin',
  async serve (context) {
    if (context.path === '/dist/custom-elements.json') {
      return generateCustomElementsManifest();
    }
  },
};

export default {
  port: 7777,
  nodeResolve: true,
  watch: true,
  mimeTypes: {},
  plugins: [
    {
      name: 'hmr-i18n',
      async transform (context) {

        // TODO: replace force re render with a call to LitELement requestUpdate() somehow (to keep state)
        const TRANSLATION_FILE_REGEX = /^\/src\/translations\/translations\.[a-z]+\.js$/;
        if (TRANSLATION_FILE_REGEX.test(context.path)) {
          // language=JavaScript
          context.body += `
            ;
            ;
            // Injected by custom HMR for i18n
            import { addTranslations } from '../lib/i18n.js';

            if (import.meta.hot) {
              import.meta.hot.accept((mod) => {

                // Let's add the new translations
                addTranslations(mod.lang, mod.translations);

                // Let's find all our LitElement base custom elements in the story
                // and force requestUpdate() on all their properties
                const customElements = Array
                  .from(document.querySelectorAll(':defined'))
                  .forEach((el) => {
                    if (el.requestUpdate != null) {
                      const properties = Object.keys(el.constructor.properties);
                      for (const prop of properties) {
                        el.requestUpdate(prop);
                      }
                    }
                  });
              });
            }
          `;
        }
      },
    },
    hmrPlugin({
      include: ['src/**/*'],
      presets: [presets.litElement],
    }),
    cemAnalyzerPlugin,
  ],
};
