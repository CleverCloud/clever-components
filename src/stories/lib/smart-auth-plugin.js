/**
 * @import { Plugin } from 'vite'
 */

/**
 * A Vite plugin that injects Clever Cloud Authentication tokens.
 * !! Caution: NEVER USE THIS PLUGIN FOR THE PROD BUILD !!
 *
 * @type {Plugin}
 */
export const injectAuthForSmartComponentsPlugin = {
  name: 'inject-auth-for-smart-components',
  async transform(code, id) {
    const SMART_COMPONENT_STORY_REGEX = /\/src\/components\/.*\/cc-.*\.smart.*\.md$/;
    const isSmartStory = SMART_COMPONENT_STORY_REGEX.test(id);
    const isDemoSmartIndex = id.includes('/demo-smart/index.js');
    const isSandboxIndex = id.includes('/sandbox/index.js');

    if (isSmartStory || isDemoSmartIndex || isSandboxIndex) {
      const {
        WARP_10_HOST,
        API_HOST,
        API_OAUTH_TOKEN,
        API_OAUTH_TOKEN_SECRET,
        OAUTH_CONSUMER_KEY,
        OAUTH_CONSUMER_SECRET,
      } = process.env;

      // language=JavaScript
      code += `
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

    if (isSmartStory) {
      // language=JavaScript
      code = `
        import { updateRootContext } from '../../lib/smart/smart-manager.js';
        import '${id.replace('.md', '.js')}';

        ${code}
      `;
    }

    return code;
  },
};
