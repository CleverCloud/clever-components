// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllExposedEnvVars, updateAllExposedEnvVars } from '@clevercloud/client/esm/api/v2/application.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { toNameValueObject } from '@clevercloud/client/esm/utils/env-vars.js';
import { fetchApp } from '../../lib/api-helpers.js';
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
 * @typedef {import('../../lib/smart/smart-component.types.d.ts').OnContextUpdateArgs<CcEnvVarForm>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-env-var-form[context="exposed-config"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, onEvent, updateComponent, signal }) {
    updateComponent('state', { type: 'loading' });

    const { apiConfig, ownerId, appId } = context;

    Promise.all([
      fetchApp({ apiConfig, signal, ownerId, appId }),
      fetchExposedConfig({ apiConfig, signal, ownerId, appId }),
    ])
      .then(([app, variables]) => {
        updateComponent('appName', app.name);
        updateComponent('state', { type: 'loaded', validationMode: 'simple', variables });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-env-var-form:submit', (variables) => {
      updateComponent(
        'state',
        /** @param {EnvVarFormState} state */
        (state) => {
          state.type = 'saving';
        },
      );
      updateExposedConfig({ apiConfig, ownerId, appId, variables, signal })
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
function fetchExposedConfig({ apiConfig, signal, ownerId, appId }) {
  return getAllExposedEnvVars({ id: ownerId, appId })
    .then(sendToApi({ apiConfig, signal }))
    .then(
      /** @param {{ [key: string]: string }} exposedVarsObject */
      (exposedVarsObject) => {
        return Object.entries(exposedVarsObject).map(([name, value]) => ({ name, value }));
      },
    );
}

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {AbortSignal} params.signal
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @param {Array<EnvVar>} params.variables
 * @returns {Promise<void>}
 */
function updateExposedConfig({ apiConfig, signal, ownerId, appId, variables }) {
  const variablesObject = toNameValueObject(variables);
  return updateAllExposedEnvVars({ id: ownerId, appId }, variablesObject).then(sendToApi({ apiConfig, signal }));
}
