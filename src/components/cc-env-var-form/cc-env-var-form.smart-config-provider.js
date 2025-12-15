import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
import { getConfigProviderEnv, updateConfigProviderEnv } from '@clevercloud/client/esm/api/v4/addon.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-env-var-form.js';

/**
 * @import { CcEnvVarForm } from './cc-env-var-form.js'
 * @import { EnvVarFormState, EnvVarFormStateLoaded, EnvVarFormStateSaving } from './cc-env-var-form.types.js'
 * @import { EnvVar, Addon } from '../common.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
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

    updateComponent('state', { type: 'loading' });
    updateComponent('resourceId', addonId);

    /** @type {string} realAddonId */
    let realAddonId = null;

    fetchAddon({ apiConfig, ownerId, addonId, signal })
      .then(
        /** @param {Addon} addon */
        (addon) => {
          updateComponent('addonName', addon.name);
          realAddonId = addon.realId;
          return fetchVariables({ apiConfig, realAddonId, signal });
        },
      )
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
      updateVariables({ apiConfig, realAddonId, variables })
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
 * @param {ApiConfig} params.apiConfig
 * @param {AbortSignal} params.signal
 * @param {string} params.ownerId
 * @param {string} params.addonId
 * @returns {Promise<Addon>}
 */
function fetchAddon({ apiConfig, signal, ownerId, addonId }) {
  return getAddon({ id: ownerId, addonId }).then(sendToApi({ apiConfig, signal }));
}

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {AbortSignal} params.signal
 * @param {string} params.realAddonId
 * @returns {Promise<Array<EnvVar>>}
 */
async function fetchVariables({ apiConfig, signal, realAddonId }) {
  return getConfigProviderEnv({ configurationProviderId: realAddonId }).then(sendToApi({ apiConfig, signal }));
}

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.realAddonId
 * @param {Array<EnvVar>} params.variables
 * @returns {Promise<Addon>}
 */
async function updateVariables({ apiConfig, realAddonId, variables }) {
  return updateConfigProviderEnv({ configurationProviderId: realAddonId }, variables).then(sendToApi({ apiConfig }));
}
