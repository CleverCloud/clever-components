import { GetEnvironmentCommand } from '@clevercloud/client/cc-api-commands/environment/get-environment-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-env-var-form.js';

/**
 * @import { CcEnvVarForm } from './cc-env-var-form.js'
 * @import { EnvVar } from '../common.types.js'
 * @import { CcApiClient } from '@clevercloud/client/cc-api-client.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-env-var-form[context="env-var-addon"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcEnvVarForm>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    updateComponent('state', { type: 'loading' });
    updateComponent('resourceId', addonId);

    fetchEnvVars({ ccApiClient, signal, ownerId, addonId })
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
 * @param {CcApiClient} params.ccApiClient
 * @param {AbortSignal} params.signal
 * @param {string} params.ownerId
 * @param {string} params.addonId
 * @returns {Promise<Array<EnvVar>>}
 */
async function fetchEnvVars({ ccApiClient, signal, ownerId, addonId }) {
  const { environment } = await ccApiClient.send(new GetEnvironmentCommand({ ownerId, addonId }), { signal });
  return environment;
}
