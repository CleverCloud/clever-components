// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { generateDocsHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-info.js';

/**
 * @typedef {import('./cc-addon-info.js').CcAddonInfo} CcAddonInfo
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoading} AddonInfoStateLoading
 * @typedef {import('./cc-addon-info.types.js').RawAddon} RawAddon
 * @typedef {import('../cc-addon-header/cc-addon-header.types.js').KubeInfo} KubeInfo
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonInfo>} OnContextUpdateArgs
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 */

/** @type {AddonInfoStateLoading} */
const LOADING_STATE = {
  type: 'loading',
  version: {
    stateType: 'up-to-date',
    installed: '0.0.0',
    latest: '0.0.0',
  },
  creationDate: '2025-08-06 15:03:00',
};

defineSmartComponent({
  selector: 'cc-addon-info[smart-mode="kubernetes"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    clusterId: { type: String },
  },
  /** @param {OnContextUpdateArgs} _ */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, clusterId } = context;

    const api = new Api({ apiConfig, ownerId, clusterId, signal });

    updateComponent('state', LOADING_STATE);
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.kubernetes'),
      href: generateDocsHref('/kubernetes'),
    });

    api
      .getKubeInfo(ownerId, clusterId)
      .then((kubeInfo) => {
        updateComponent('state', {
          type: 'loaded',
          version: { stateType: 'up-to-date', installed: kubeInfo.version, latest: kubeInfo.version },
          creationDate: kubeInfo.creationDate,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

class Api {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig - API configuration
   * @param {string} params.ownerId - Owner identifier
   * @param {string} params.clusterId - Cluster identifier
   * @param {AbortSignal} params.signal - Signal to abort calls
   */
  constructor({ apiConfig, ownerId, clusterId, signal }) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._clusterId = clusterId;
    this._signal = signal;
  }

  /**
   * @param {string} ownerId
   * @param {string} clusterId
   * @return {Promise<KubeInfo>}
   */
  getKubeInfo(ownerId, clusterId) {
    return getKubeInfo({ ownerId, clusterId })
      .then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }))
      .then((kubeInfo) => {
        if (kubeInfo.status === 'DELETED') {
          throw new Error('This cluster has been deleted');
        }
        return kubeInfo;
      });
  }
}

// FIXME: remove and use the clever-client call from the new clever-client
/** @param {{ ownerId: string, clusterId: string }} params */
function getKubeInfo(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}`,
    // no queryParams
    // no body
  });
}
