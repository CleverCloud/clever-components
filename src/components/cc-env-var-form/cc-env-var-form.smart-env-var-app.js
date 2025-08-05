// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllEnvVars, updateAllEnvVars } from '@clevercloud/client/esm/api/v2/application.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { toNameValueObject } from '@clevercloud/client/esm/utils/env-vars.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-env-var-form.js';

/**
 * @typedef {import('./cc-env-var-form.js').CcEnvVarForm} CcEnvVarForm
 * @typedef {import('./cc-env-var-form.types.js').EnvVarFormState} EnvVarFormState
 * @typedef {import('./cc-env-var-form.types.js').EnvVarFormStateLoaded} EnvVarFormStateLoaded
 * @typedef {import('./cc-env-var-form.types.js').EnvVarFormStateSaving} EnvVarFormStateSaving
 * @typedef {import('../common.types.js').EnvVar} EnvVar
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcEnvVarForm>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-env-var-form[context="env-var-app"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, onEvent, updateComponent, signal }) {
    const { apiConfig, ownerId, appId } = context;

    updateComponent('state', { type: 'loading' });
    updateComponent('resourceId', appId);

    fetchEnvVars({ apiConfig, signal, ownerId, appId })
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
      const newVarsObject = toNameValueObject(variables);
      updateVariables({ apiConfig, ownerId, appId, newVarsObject })
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
 * @param {string} params.appId
 * @returns {Promise<Array<EnvVar>>}
 */
function fetchEnvVars({ apiConfig, signal, ownerId, appId }) {
  return getAllEnvVars({ id: ownerId, appId }).then(sendToApi({ apiConfig, signal }));
}

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @param {Array<EnvVar>} params.newVarsObject
 */
async function updateVariables({ apiConfig, ownerId, appId, newVarsObject }) {
  return updateAllEnvVars({ id: ownerId, appId }, newVarsObject).then(sendToApi({ apiConfig }));
}
