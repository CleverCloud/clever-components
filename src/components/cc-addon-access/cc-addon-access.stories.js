import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-addon-access.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Addon dashboards/<cc-addon-access-beta>',
  component: 'cc-addon-access-beta',
};

const conf = {
  component: 'cc-addon-access-beta',
};

/**
 * @typedef {import('./cc-addon-access.js').CcAddonAccess} CcAddonAccess
 */

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tabs: {
          default: [
            { code: 'user', value: 'toto-user' },
            { code: 'password', value: 'my-secret-password' },
            { code: 'token', value: 'my-token' },
            { code: 'ng', value: { status: 'enabled', id: 'fake-ng-id' } },
          ],
        },
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
});

export const dataLoadedWithTabs = makeStory(conf, {
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loaded',
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
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          default: [
            { code: 'user', value: 'toto-user' },
            { code: 'password', value: 'my-secret-password' },
            { code: 'token', value: 'my-token' },
            { code: 'ng', value: { status: 'disabled' } },
          ],
        },
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
});

export const loadingWithTabs = makeStory(conf, {
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loading',
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
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
});

export const simulationWithLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          default: [
            { code: 'user', value: 'toto-user' },
            { code: 'password', value: 'my-secret-password' },
            { code: 'token', value: 'my-token' },
            { code: 'ng', value: { status: 'disabled' } },
          ],
        },
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonAccess[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: [
              { code: 'user', value: 'toto-user' },
              { code: 'password', value: 'my-secret-password' },
              { code: 'token', value: 'my-token' },
              { code: 'ng', value: { status: 'disabled' } },
            ],
          },
        };
      },
    ),
  ],
});

export const simulationsWithTabsAndLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loading',
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
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonAccess[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
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
        };
      },
    ),
  ],
});

export const simulationsWithLoadingError = makeStory(conf, {
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          default: [
            { code: 'user', value: 'toto-user' },
            { code: 'password', value: 'my-secret-password' },
            { code: 'token', value: 'my-token' },
            { code: 'ng', value: { status: 'disabled' } },
          ],
        },
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonAccess[]} components */
      ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});

export const simulationsWithNetworkGroupStatus = makeStory(conf, {
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tabs: {
          default: [
            { code: 'user', value: 'toto-user' },
            { code: 'ng', value: { status: 'disabled' } },
          ],
        },
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonAccess[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: [
              { code: 'user', value: 'toto-user' },
              { code: 'ng', value: { status: 'enabling' } },
            ],
          },
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcAddonAccess[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: [
              { code: 'user', value: 'toto-user' },
              { code: 'ng', value: { status: 'enabled', id: 'fake-ng-id-12345' } },
            ],
          },
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcAddonAccess[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: [
              { code: 'user', value: 'toto-user' },
              { code: 'ng', value: { status: 'disabling', id: 'fake-ng-id-12345' } },
            ],
          },
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcAddonAccess[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: [
              { code: 'user', value: 'toto-user' },
              { code: 'ng', value: { status: 'disabled' } },
            ],
          },
        };
      },
    ),
  ],
});
