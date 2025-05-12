// prettier-ignore
// @ts-ignore
import { createGrafanaOrganisation,deleteGrafanaOrganisation,getGrafanaOrganisation,resetGrafanaOrganisation,} from '@clevercloud/client/esm/api/v4/saas.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-grafana-info.js';

/**
 * @typedef {import('./cc-grafana-info.js').CcGrafanaInfo} CcGrafanaInfo
 * @typedef {import('./cc-grafana-info.types.js').GrafanaInfoState} GrafanaInfoState
 * @typedef {import('./cc-grafana-info.types.js').GrafanaInfoStateLoaded} GrafanaInfoStateLoaded
 * @typedef {import('./cc-grafana-info.types.js').GrafanaInfoEnabled} GrafanaInfoEnabled
 * @typedef {import('./cc-grafana-info.types.js').GrafanaInfoDisabled} GrafanaInfoDisabled
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcGrafanaInfo>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-grafana-info',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    grafanaBaseLink: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
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
        ? enableGrafanaOrganisation({ apiConfig, ownerId })
            .then(() => {
              fetch();
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
 * @param {ApiConfig} params.apiConfig
 * @param {AbortSignal} params.signal
 * @param {string} params.ownerId
 * @param {string} params.grafanaBaseLink
 * @returns {Promise<GrafanaInfoEnabled|GrafanaInfoDisabled>}
 */
function fetchGrafanaOrganisation({ apiConfig, signal, ownerId, grafanaBaseLink }) {
  return getGrafanaOrganisation({ id: ownerId })
    .then(sendToApi({ apiConfig, signal }))
    .then(
      /** @param {{id: string}} exposedVarsObject */ (exposedVarsObject) => {
        const grafanaLink = new URL('/d/home/clever-cloud-metrics-home', grafanaBaseLink);
        grafanaLink.searchParams.set('orgId', exposedVarsObject.id);
        /** @type {GrafanaInfoEnabled} */
        const grafanaInfo = { status: 'enabled', link: grafanaLink.toString() };
        return grafanaInfo;
      },
    )
    .catch(
      /** @param {{response?: {status: number}}} error */ (error) => {
        if (error.response?.status === 404 && error.toString().startsWith('Error: Grafana organization not found')) {
          return { status: 'disabled' };
        } else {
          throw error;
        }
      },
    );
}

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @returns {Promise<void>}
 */
function doResetGrafanaOrganisation({ apiConfig, ownerId }) {
  return resetGrafanaOrganisation({ id: ownerId }).then(sendToApi({ apiConfig }));
}

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @returns {Promise<void>}
 */
function disableGrafanaOrganisation({ apiConfig, ownerId }) {
  return deleteGrafanaOrganisation({ id: ownerId }).then(sendToApi({ apiConfig }));
}

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @returns {Promise<void>}
 */
function enableGrafanaOrganisation({ apiConfig, ownerId }) {
  return createGrafanaOrganisation({ id: ownerId }).then(sendToApi({ apiConfig }));
}
