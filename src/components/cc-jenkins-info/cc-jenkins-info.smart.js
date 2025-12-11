// @ts-expect-error FIXME: remove when clever-client exports types
import { getAddon, getJenkinsUpdates } from '@clevercloud/client/esm/api/v4/addon-providers.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-jenkins-info.js';

/**
 * @import { CcJenkinsInfo } from './cc-jenkins-info.js'
 * @import { JenkinsInfoStateLoaded } from './cc-jenkins-info.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-jenkins-info',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcJenkinsInfo>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
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
