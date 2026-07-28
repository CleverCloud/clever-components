import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { GetConfigProviderCommand } from '@clevercloud/client/cc-api-commands/config-provider/get-config-provider-command.js';
import { UpdateConfigProviderCommand } from '@clevercloud/client/cc-api-commands/config-provider/update-config-provider-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-env-var-form.js';

/**
 * @import { CcEnvVarForm } from './cc-env-var-form.js'
 * @import { EnvVarFormState, EnvVarFormStateLoaded, EnvVarFormStateSaving } from './cc-env-var-form.types.js'
 * @import { EnvVar } from '../common.types.js'
 * @import { CcApiClient } from '@clevercloud/client/cc-api-client.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-env-var-form[context="config-provider"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcEnvVarForm>} args
   */
  onContextUpdate({ context, onEvent, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    updateComponent('state', { type: 'loading' });
    updateComponent('resourceId', addonId);

    /** @type {string} realAddonId */
    let realAddonId = null;

    fetchAddon({ ccApiClient, ownerId, addonId, signal })
      .then((addon) => {
        updateComponent('addonName', addon.name);
        realAddonId = addon.realId;
        return fetchVariables({ ccApiClient, realAddonId, signal });
      })
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

    onEvent('cc-env-var-form-submit', (variables) => {
      updateComponent(
        'state',
        /** @param {EnvVarFormState} state */
        (state) => {
          state.type = 'saving';
        },
      );
      updateVariables({ ccApiClient, realAddonId, variables })
        .then(() => {
          updateComponent(
            'state',
            /** @param {EnvVarFormStateSaving} state */
            (state) => {
              state.variables = variables;
            },
          );
          notifySuccess(i18n('cc-env-var-form.update.success'));
        })
        .catch(() => notifyError(i18n('cc-env-var-form.update.error')))
        .finally(() => {
          updateComponent(
            'state',
            /** @param {EnvVarFormStateLoaded} state */
            (state) => {
              state.type = 'loaded';
            },
          );
        });
    });
  },
});

/**
 * @param {object} params
 * @param {CcApiClient} params.ccApiClient
 * @param {AbortSignal} params.signal
 * @param {string} params.ownerId
 * @param {string} params.addonId
 */
function fetchAddon({ ccApiClient, signal, ownerId, addonId }) {
  return ccApiClient.send(new GetAddonCommand({ ownerId, addonId }), { signal });
}

/**
 * @param {object} params
 * @param {CcApiClient} params.ccApiClient
 * @param {AbortSignal} params.signal
 * @param {string} params.realAddonId
 * @returns {Promise<Array<EnvVar>>}
 */
function fetchVariables({ ccApiClient, signal, realAddonId }) {
  return ccApiClient.send(new GetConfigProviderCommand({ addonId: realAddonId }), { signal });
}

/**
 * @param {object} params
 * @param {CcApiClient} params.ccApiClient
 * @param {string} params.realAddonId
 * @param {Array<EnvVar>} params.variables
 * @returns {Promise<Array<EnvVar>>}
 */
async function updateVariables({ ccApiClient, realAddonId, variables }) {
  return ccApiClient.send(new UpdateConfigProviderCommand({ addonId: realAddonId, environment: variables }));
}
