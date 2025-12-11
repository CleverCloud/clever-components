//prettier-ignore
// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllDeployments,getAllEnvVars,redeploy,updateAllEnvVars } from '@clevercloud/client/esm/api/v2/application.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { toNameValueObject } from '@clevercloud/client/esm/utils/env-vars.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcEnvVarsWasUpdatedEvent } from './cc-env-var-form.events.js';
import './cc-env-var-form.js';

// This happens when the app has never be deployed at all, we cannot deploy it because there is no commit to deploy
const APP_CANNOT_BE_DEPLOYED_ERROR_CODE = 4014;

/**
 * @import { CcEnvVarForm } from './cc-env-var-form.js'
 * @import { EnvVarFormState, EnvVarFormStateLoaded, EnvVarFormStateSaving } from './cc-env-var-form.types.js'
 * @import { EnvVar } from '../common.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-env-var-form[context="env-var-app"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
    logsUrlPattern: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcEnvVarForm>} args
   */
  onContextUpdate({ context, onEvent, updateComponent, component, signal }) {
    const { apiConfig, ownerId, appId, logsUrlPattern } = context;
    const api = new Api({ apiConfig, ownerId, appId, signal });

    updateComponent('state', { type: 'loading' });
    updateComponent('resourceId', appId);
    updateComponent('restartApp', false);

    api
      .fetchEnvVars()
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
      api
        .updateVariables(newVarsObject)
        .then(() => {
          updateComponent(
            'state',
            /** @param {EnvVarFormStateSaving} state */
            (state) => {
              state.variables = variables;
            },
          );
          notifySuccess(i18n('cc-env-var-form.update.success'));

          api.hasDeployments().then((hasDeployments) => {
            if (hasDeployments) {
              updateComponent('restartApp', true);
            }
          });

          // Warn the console that env vars have been updated successfully so it can update the EOL variables list
          component.dispatchEvent(new CcEnvVarsWasUpdatedEvent(variables));
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

    onEvent('cc-application-restart', () => {
      api
        .redeployApp()
        .then(() => {
          updateComponent('restartApp', false);

          notifySuccess(
            i18n('cc-env-var-form.redeploy.success.text', { logsUrl: logsUrlPattern.replace(':id', appId) }),
            i18n('cc-env-var-form.redeploy.success.heading'),
          );
        })
        .catch((/** @type {Error & { id: number }} */ error) => {
          console.error(error);
          if (error.id === APP_CANNOT_BE_DEPLOYED_ERROR_CODE) {
            notifyError(i18n('cc-env-var-form.redeploy.error.app-stopped'));
          } else {
            notifyError(i18n('cc-env-var-form.redeploy.error'));
          }
        });
    });
  },
});

class Api {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {AbortSignal} params.signal
   * @param {string} params.ownerId
   * @param {string} params.appId
   */
  constructor({ apiConfig, ownerId, appId, signal }) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._appId = appId;
    this._signal = signal;
  }

  /** @returns {Promise<Array<EnvVar>>} */
  fetchEnvVars() {
    return getAllEnvVars({ id: this._ownerId, appId: this._appId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

  /** @param {Array<EnvVar>} newVarsObject */
  updateVariables(newVarsObject) {
    return updateAllEnvVars({ id: this._ownerId, appId: this._appId }, newVarsObject).then(
      sendToApi({ apiConfig: this._apiConfig }),
    );
  }

  async hasDeployments() {
    const deployments = await getAllDeployments({ id: this._ownerId, appId: this._appId }).then(
      sendToApi({ apiConfig: this._apiConfig }),
    );
    return deployments.length > 0;
  }

  redeployApp() {
    return redeploy({ id: this._ownerId, appId: this._appId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }
}
