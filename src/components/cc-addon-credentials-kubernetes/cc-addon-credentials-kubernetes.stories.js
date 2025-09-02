import { getFilteredAddonCredentials } from '../../stories/fixtures/addon-access-data.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-addon-credentials-kubernetes.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-credentials-kubernetes>',
  component: 'cc-addon-credentials-kubernetes',
};

const conf = {
  component: 'cc-addon-credentials-kubernetes',
};

/** @typedef {import('./cc-addon-credentials-kubernetes.js').CcAddonCredentialsKubernetes} CcAddonCredentialsKubernetes */

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsKubernetes>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tabs: {
          default: getFilteredAddonCredentials(['api-server-url', 'download-kubeconfig']),
        },
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsKubernetes>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          default: getFilteredAddonCredentials(['api-server-url', 'download-kubeconfig']),
        },
      },
    },
  ],
});

export const error = makeStory(conf, {
  items: [{ state: { type: 'error' } }],
});

export const simulationWithLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsKubernetes>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          default: getFilteredAddonCredentials(['api-server-url', 'download-kubeconfig']),
        },
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonCredentialsKubernetes[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: getFilteredAddonCredentials(['api-server-url', 'download-kubeconfig']),
          },
        };
      },
    ),
  ],
});

export const simulationsWithLoadingError = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsKubernetes>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          default: getFilteredAddonCredentials(['api-server-url', 'download-kubeconfig']),
        },
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonCredentialsKubernetes[]} components */
      ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});
