import { makeStory } from '../../stories/lib/make-story.js';
import './cc-addon-access-unique.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-access-unique>',
  component: 'cc-addon-access-unique-beta',
};

const conf = {
  component: 'cc-addon-access-unique-beta',
};

/**
 * @typedef {import('./cc-addon-access-unique.js').CcAddonAccessUnique} CcAddonAccessUnique
 */

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcAddonAccessUnique>[]} */
  items: [
    {
      state: {
        type: 'loaded-with-tabs',
        tabs: [
          {
            tabName: 'elastic',
            host: 'example.com',
            user: 'toto',
            password: 'my-secret-password',
          },
          {
            tabName: 'kibana',
            user: 'toto-kibana',
            password: 'my-secret-password-for-kibana',
          },
          {
            tabName: 'apm',
            user: 'toto-apm',
            password: 'my-secret-password-apm',
            token: 'my-token-for-apm',
          },
        ],
        cliCommand: 'my-fake-command --port 029238 --host example.com',
      },
    },
  ],
});
