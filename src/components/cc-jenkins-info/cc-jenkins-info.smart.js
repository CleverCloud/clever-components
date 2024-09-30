// @ts-expect-error FIXME: remove when clever-client exports types
import { getAddon, getJenkinsUpdates } from '@clevercloud/client/esm/api/v4/addon-providers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-jenkins-info.js';

/**
 * @typedef {import('./cc-jenkins-info.js').CcJenkinsInfo} CcJenkinsInfo
 * @typedef {import('./cc-jenkins-info.types.js').JenkinsInfoStateLoaded} JenkinsInfoStateLoaded
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 */

defineSmartComponent({
  selector: 'cc-jenkins-info',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
  },
  /**
   * @param {Object} settings
   * @param {CcJenkinsInfo} settings.component
   * @param {{ apiConfig: ApiConfig, ownerId: string, addonId: string }} settings.context
   * @param {(type: string, listener: (detail: any) => void) => void} settings.onEvent
   * @param {function} settings.updateComponent
   * @param {AbortSignal} settings.signal
   */
  // @ts-expect-error FIXME: remove once `onContextUpdate` is typed with generics
  onContextUpdate({ component, context, updateComponent, signal }) {
    const { apiConfig, addonId } = context;

    updateComponent('state', { type: 'loading' });

    fetchJenkinsAddon({ apiConfig, signal, addonId })
      .then((jenkinsAddon) => {
        updateComponent('state', {
          type: 'loaded',
          jenkinsLink: jenkinsAddon.jenkinsLink,
          jenkinsManageLink: jenkinsAddon.jenkinsManageLink,
          versions: jenkinsAddon.versions,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {AbortSignal} params.signal
 * @param {string} params.addonId
 * @returns {Promise<Omit<JenkinsInfoStateLoaded, 'type'>>}
 */
function fetchJenkinsAddon({ apiConfig, signal, addonId }) {
  return Promise.all([
    getAddon({ providerId: 'jenkins', addonId }).then(sendToApi({ apiConfig, signal })),
    getJenkinsUpdates({ addonId }).then(sendToApi({ apiConfig, signal })),
  ]).then(([addon, jenkinsUpdates]) => {
    return {
      jenkinsLink: `https://${addon.host}`,
      jenkinsManageLink: jenkinsUpdates.manageLink,
      versions: jenkinsUpdates.versions,
    };
  });
}
