import { GetMetricsCommand } from '@clevercloud/client/cc-api-commands/metrics/get-metrics-command.js';
import { getGrafanaOrganisation } from '@clevercloud/client/esm/api/v4/saas.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-tile-metrics.js';

/**
 * @import { CcTileMetrics } from './cc-tile-metrics.js'
 * @import { MetricsData, Metric } from './cc-tile-metrics.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

const NUMBER_OF_POINTS = 24;

defineSmartComponent({
  selector: 'cc-tile-metrics',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
    grafanaLink: { type: Object, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs<CcTileMetrics>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, appId, grafanaLink } = context;

    updateComponent('metricsState', { type: 'loading' });

    fetchMetrics({ apiConfig, ownerId, appId, signal })
      .then(({ cpuMetrics, memMetrics }) => {
        if (cpuMetrics.length === 0 || memMetrics.length === 0 || isAppStopped(cpuMetrics)) {
          updateComponent('metricsState', { type: 'empty' });
        } else {
          updateComponent('metricsState', {
            type: 'loaded',
            metricsData: { cpuMetrics, memMetrics },
          });
        }
      })
      .catch((error) => {
        console.error(error);
        updateComponent('metricsState', { type: 'error' });
      });

    if (grafanaLink == null) {
      updateComponent('grafanaLinkState', { type: 'hidden' });
    } else {
      updateComponent('grafanaLinkState', { type: 'loading' });
      fetchGrafanaAppLink({ apiConfig, ownerId, appId, grafanaBaseLink: grafanaLink.base, signal })
        .then((grafanaAppLink) => {
          updateComponent('grafanaLinkState', { type: 'loaded', link: grafanaAppLink });
        })
        .catch(() => {
          // If Grafana is not enabled we fallback to the Console Grafana page
          updateComponent('grafanaLinkState', { type: 'loaded', link: grafanaLink.console });
        });
    }
  },
});

/**
 * @param {Object} parameters
 * @param {ApiConfig} parameters.apiConfig
 * @param {string} parameters.ownerId
 * @param {string} parameters.appId
 * @param {AbortSignal} parameters.signal
 * @returns {Promise<MetricsData>}
 */
async function fetchMetrics({ apiConfig, ownerId, appId, signal }) {
  const client = getCcApiClientWithOAuth(apiConfig);

  const metrics = await client.send(
    new GetMetricsCommand({
      ownerId,
      applicationId: appId,
      interval: 'P1D',
      span: 'PT1H',
      metrics: ['cpu', 'mem'],
      timestampUnit: 'ms',
    }),
    { signal },
  );

  return {
    cpuMetrics: metrics.cpu ?? [],
    memMetrics: metrics.mem ?? [],
  };
}

/**
 * @param {Object} parameters
 * @param {ApiConfig} parameters.apiConfig
 * @param {string} parameters.ownerId
 * @param {string} parameters.appId
 * @param {string} parameters.grafanaBaseLink
 * @param {AbortSignal} parameters.signal
 * @returns {Promise<string>}
 */
function fetchGrafanaAppLink({ apiConfig, ownerId, appId, grafanaBaseLink, signal }) {
  return getGrafanaOrganisation({ id: ownerId })
    .then(sendToApi({ apiConfig, signal }))
    .then(
      /** @param {{id: string}} grafanaOrg*/ (grafanaOrg) => {
        const grafanaLink = new URL('/d/runtime/application-runtime', grafanaBaseLink);
        grafanaLink.searchParams.set('orgId', grafanaOrg.id);
        grafanaLink.searchParams.set('var-SELECT_APP', appId);
        return grafanaLink.toString();
      },
    );
}

/**
 * @param {Metric[]} data
 * @returns {boolean}
 */
function isAppStopped(data) {
  return data.filter((data) => data.value === 0).length === NUMBER_OF_POINTS;
}
