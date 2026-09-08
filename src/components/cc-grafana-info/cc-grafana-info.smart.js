import { DisableGrafanaCommand } from '@clevercloud/client/cc-api-commands/grafana/disable-grafana-command.js';
import { EnableGrafanaCommand } from '@clevercloud/client/cc-api-commands/grafana/enable-grafana-command.js';
import { GetGrafanaCommand } from '@clevercloud/client/cc-api-commands/grafana/get-grafana-command.js';
import { ResetGrafanaCommand } from '@clevercloud/client/cc-api-commands/grafana/reset-grafana-command.js';
import { tolerateNotFound } from '@clevercloud/client/utils/error-utils.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-grafana-info.js';

/**
 * @import { CcGrafanaInfo } from './cc-grafana-info.js'
 * @import { GrafanaInfoStateLoaded, GrafanaInfoEnabled, GrafanaInfoDisabled } from './cc-grafana-info.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-grafana-info',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    grafanaBaseLink: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcGrafanaInfo>} args
   */
  onContextUpdate({ context, updateComponent, onEvent, signal }) {
    const { apiConfig, ownerId, grafanaBaseLink } = context;

    updateComponent('state', { type: 'loading' });

    function fetch() {
      fetchGrafanaOrganisation({ apiConfig, signal, ownerId, grafanaBaseLink })
        .then((info) => {
          updateComponent('state', { type: 'loaded', info });
        })
        .catch((error) => {
          console.error(error);
          updateComponent('state', { type: 'error' });
        });
    }

    onEvent('cc-grafana-reset', () => {
      updateComponent(
        'state',
        /** @param {GrafanaInfoStateLoaded & { info: GrafanaInfoEnabled | GrafanaInfoDisabled }} state */
        (state) => {
          state.info.action = 'resetting';
        },
      );

      doResetGrafanaOrganisation({ apiConfig, ownerId })
        .then(() => notifySuccess(i18n('cc-grafana-info.reset.success')))
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-grafana-info.reset.error'));
        })
        .finally(() => {
          updateComponent(
            'state',
            /** @param {GrafanaInfoStateLoaded & { info: GrafanaInfoEnabled | GrafanaInfoDisabled }} state */
            (state) => {
              state.info.action = null;
            },
          );
        });
    });

    onEvent('cc-grafana-toggle', ({ isEnabled }) => {
      updateComponent(
        'state',
        /** @param {GrafanaInfoStateLoaded & { info: GrafanaInfoEnabled | GrafanaInfoDisabled }} state */
        (state) => {
          state.info.action = isEnabled ? 'enabling' : 'disabling';
        },
      );

      const promise = isEnabled
        ? enableGrafanaOrganisation({ apiConfig, ownerId, grafanaBaseLink })
            .then((info) => {
              updateComponent('state', { type: 'loaded', info });
              notifySuccess(i18n('cc-grafana-info.enable.success'));
            })
            .catch((error) => {
              console.error(error);
              notifyError(i18n('cc-grafana-info.enable.error'));
            })
        : disableGrafanaOrganisation({ apiConfig, ownerId })
            .then(() => {
              updateComponent(
                'state',
                /** @param {GrafanaInfoStateLoaded & { info: GrafanaInfoEnabled | GrafanaInfoDisabled }} state */
                (state) => {
                  state.info = { status: 'disabled' };
                },
              );
              notifySuccess(i18n('cc-grafana-info.disable.success'));
            })
            .catch((error) => {
              console.error(error);
              notifyError(i18n('cc-grafana-info.disable.error'));
            });

      promise.finally(() => {
        updateComponent(
          'state',
          /** @param {GrafanaInfoStateLoaded & { info: GrafanaInfoEnabled | GrafanaInfoDisabled }} state */
          (state) => {
            state.info.action = null;
          },
        );
      });
    });

    fetch();
  },
});

/**
 * @param {object} params
 * @param {number} params.orgId
 * @param {string} params.grafanaBaseLink
 * @returns {string}
 */
function buildGrafanaLink({ orgId, grafanaBaseLink }) {
  const grafanaLink = new URL('/d/home/clever-cloud-metrics-home', grafanaBaseLink);
  grafanaLink.searchParams.set('orgId', String(orgId));
  return grafanaLink.toString();
}

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {AbortSignal} params.signal
 * @param {string} params.ownerId
 * @param {string} params.grafanaBaseLink
 * @returns {Promise<GrafanaInfoEnabled|GrafanaInfoDisabled>}
 */
async function fetchGrafanaOrganisation({ apiConfig, signal, ownerId, grafanaBaseLink }) {
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  // the command rejects with a 404 when this owner has no Grafana organisation
  const grafanaOrg = await tolerateNotFound(ccApiClient.send(new GetGrafanaCommand({ ownerId }), { signal }));

  if (grafanaOrg == null) {
    return { status: 'disabled' };
  }

  return { status: 'enabled', link: buildGrafanaLink({ orgId: grafanaOrg.id, grafanaBaseLink }) };
}

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @returns {Promise<void>}
 */
function doResetGrafanaOrganisation({ apiConfig, ownerId }) {
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  return ccApiClient.send(new ResetGrafanaCommand({ ownerId }));
}

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @returns {Promise<void>}
 */
function disableGrafanaOrganisation({ apiConfig, ownerId }) {
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  return ccApiClient.send(new DisableGrafanaCommand({ ownerId }));
}

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @param {string} params.grafanaBaseLink
 * @returns {Promise<GrafanaInfoEnabled>}
 */
async function enableGrafanaOrganisation({ apiConfig, ownerId, grafanaBaseLink }) {
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  // the command performs the create call followed by a fetch of the created Grafana organisation
  const grafanaOrg = await ccApiClient.send(new EnableGrafanaCommand({ ownerId }));
  return { status: 'enabled', link: buildGrafanaLink({ orgId: grafanaOrg.id, grafanaBaseLink }) };
}
