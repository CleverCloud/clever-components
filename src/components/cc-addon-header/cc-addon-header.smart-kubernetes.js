import { fakeString } from '../../lib/fake-strings.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonHeaderClient } from './cc-addon-header.client.js';
import './cc-addon-header.js';

const PROVIDER_ID = 'kubernetes';

/**
 * @typedef {import('./cc-addon-header.js').CcAddonHeader} CcAddonHeader
 * @typedef {import('./cc-addon-header.types.js').DeploymentStatus} DeploymentStatus
 * @typedef {import('./cc-addon-header.types.js').RawAddon} RawAddon
 * @typedef {import('../cc-zone/cc-zone.types.js').ZoneStateLoaded} ZoneStateLoaded
 * @typedef {import('../../operators.types.js').RawOperator} RawOperator
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonHeader>} OnContextUpdateArgs
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 */

defineSmartComponent({
  selector: 'cc-addon-header[smart-mode=kubernetes]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    logsUrlPattern: { type: String },
    productStatus: { type: String, optional: true },
  },

  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId, productStatus } = context;
    const api = new Api({ apiConfig, ownerId, addonId, signal });

    updateComponent('state', {
      type: 'loading',
      configLink: fakeString(15),
      productStatus: fakeString(4),
    });

    api
      .getAddonWithOperatorAndZoneAndConfig()
      .then(({ rawAddon, operator, zone, kubeConfig }) => {
        const configDataUrl = `data:text/yaml;charset=utf-8,${encodeURIComponent(kubeConfig)}`;

        updateComponent('state', {
          type: 'loaded',
          providerId: rawAddon.provider.name,
          providerLogoUrl: rawAddon.provider.logoUrl,
          name: rawAddon.name,
          id: rawAddon.realId,
          zone,
          configLink: configDataUrl,
          productStatus,
          deploymentStatus: /** @type {DeploymentStatus} */ (operator.resources.status?.toLowerCase()),
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', {
          type: 'error',
        });
      });
  },
});

class Api extends CcAddonHeaderClient {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @param {AbortSignal} params.signal
   */
  constructor({ apiConfig, ownerId, addonId, signal }) {
    super({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, signal });
  }

  /**
   * @param {string} clusterId
   * @return {Promise<string>}
   */
  getKubeConfig(clusterId) {
    return getKubeConfig({ ownerId: this._ownerId, clusterId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

  /** @returns {Promise<{ rawAddon: RawAddon, operator: RawOperator, zone: ZoneStateLoaded, kubeConfig: string }>} */
  async getAddonWithOperatorAndZoneAndConfig() {
    const rawAddon = await this.getAddon();
    const operator = await this.getOperator(rawAddon.realId);
    const zone = await this.getZone(rawAddon.region);
    const kubeConfig = await this.getKubeConfig(operator.resources.clusterId);
    return { rawAddon, operator, zone, kubeConfig };
  }
}

// FIXME: remove and use the clever-client call from the new clever-client
/** @param {{ ownerId: string, clusterId: string }} params */
function getKubeConfig(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/kubeconfig.yaml`,
    headers: { Accept: 'text/plain, application/x-yaml, */*' },
    // no queryParams
    // no body
  });
}
