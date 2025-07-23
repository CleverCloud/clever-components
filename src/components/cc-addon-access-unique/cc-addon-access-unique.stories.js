import { makeStory } from '../../stories/lib/make-story.js';
import './cc-addon-access-unique.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-access-unique>',
  component: 'cc-addon-access-unique',
};

const conf = {
  component: 'cc-addon-access-unique',
};

/**
 * @typedef {import('./cc-addon-access-unique.js').CcAddonAccessUnique} CcAddonAccessUnique
 */

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcAddonAccessUnique>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        content: [
          { code: 'user', value: 'toto-user' },
          { code: 'password', value: 'my-secret-password' },
          { code: 'token', value: 'my-token' },
          { code: 'ng', value: { id: 'fake-ng-id', isEnabled: true } },
        ],
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
});

export const dataLoadedWithTabs = makeStory(conf, {
  /** @type {Partial<CcAddonAccessUnique>[]} */
  items: [
    {
      state: {
        type: 'loaded-with-tabs',
        tabs: {
          elastic: [
            { code: 'host', value: 'example.com' },
            { code: 'user', value: 'toto' },
            { code: 'password', value: 'my-secret-password' },
          ],
          kibana: [
            { code: 'user', value: 'toto-kibana' },
            { code: 'password', value: 'my-secret-password-for-kibana' },
          ],
          apm: [
            { code: 'user', value: 'toto-apm' },
            { code: 'password', value: 'my-secret-password-apm' },
            { code: 'token', value: 'my-token-for-apm' },
          ],
        },
        cliCommand: 'my-fake-command --port 029238 --host example.com',
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcAddonAccessUnique>[]} */
  items: [
    {
      state: {
        type: 'loading',
        content: [
          { code: 'user', value: 'toto-user' },
          { code: 'password', value: 'my-secret-password' },
          { code: 'token', value: 'my-token' },
          { code: 'ng', value: { id: 'fake-ng-id', isEnabled: true } },
        ],
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
});

export const loadingWithTabs = makeStory(conf, {
  /** @type {Partial<CcAddonAccessUnique>[]} */
  items: [
    {
      state: {
        type: 'loading-with-tabs',
        tabs: {
          elastic: [
            { code: 'host', value: 'example.com' },
            { code: 'user', value: 'toto' },
            { code: 'password', value: 'my-secret-password' },
          ],
          kibana: [
            { code: 'user', value: 'toto-kibana' },
            { code: 'password', value: 'my-secret-password-for-kibana' },
          ],
          apm: [
            { code: 'user', value: 'toto-apm' },
            { code: 'password', value: 'my-secret-password-apm' },
            { code: 'token', value: 'my-token-for-apm' },
          ],
        },
        cliCommand: 'my-fake-command --port 029238 --host example.com',
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
});
