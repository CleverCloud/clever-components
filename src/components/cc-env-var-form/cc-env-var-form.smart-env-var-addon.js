// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllEnvVars } from '@clevercloud/client/esm/api/v2/addon.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-env-var-form.js';

/**
 * @typedef {import('./cc-env-var-form.js').CcEnvVarForm} CcEnvVarForm
 * @typedef {import('../common.types.js').EnvVar} EnvVar
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcEnvVarForm>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-env-var-form[context="env-var-addon"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId } = context;

    updateComponent('state', { type: 'loading' });
    updateComponent('resourceId', addonId);

    fetchEnvVars({ apiConfig, signal, ownerId, addonId })
      .then(
        /** @param {Array<EnvVar>} variables */
        (variables) => {
          updateComponent('state', { type: 'loaded', validationMode: 'simple', variables });
        },
      )
      .catch(
        /** @param {Error} error */
        (error) => {
          console.error(error);
          updateComponent('state', { type: 'error' });
        },
      );
  },
});

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {AbortSignal} params.signal
 * @param {string} params.ownerId
 * @param {string} params.addonId
 * @returns {Promise<Array<EnvVar>>}
 */
function fetchEnvVars({ apiConfig, signal, ownerId, addonId }) {
  return getAllEnvVars({ id: ownerId, addonId }).then(sendToApi({ apiConfig, signal }));
}
