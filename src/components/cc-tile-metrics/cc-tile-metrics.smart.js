import { getOrganisationApplicationMetrics } from '@clevercloud/client/esm/api/v4/resources.js';
import { getGrafanaOrganisation } from '@clevercloud/client/esm/api/v4/saas.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-tile-metrics.js';

/**
 * @import { CcTileMetrics } from './cc-tile-metrics.js'
 * @import { RawMetric, MetricsData, Metric } from './cc-tile-metrics.types.js'
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
function fetchMetrics({ apiConfig, ownerId, appId, signal }) {
  return getOrganisationApplicationMetrics({
    ownerId,
    resourceId: appId,
    interval: 'P1D',
    span: 'PT1H',
    // @ts-expect-error FIXME: the client expects a string, which makes sense since it's using this as a query param. We should fix this but we need to check how the string is supposed to be formatted (separator, etc.)
    only: ['cpu', 'mem'],
  })
    .then(sendToApi({ apiConfig, signal }))
    .then(
      /** @param {RawMetric[]} metrics */ (metrics) => {
        const cpuMetrics = extractMetric(metrics, 'cpu');
        const memMetrics = extractMetric(metrics, 'mem');
        return { cpuMetrics, memMetrics };
      },
    );
}

/**
 * @param {RawMetric[]} metrics
 * @param {string} name
 * @returns {Metric[]}
 */
function extractMetric(metrics, name) {
  const metric = metrics?.find((m) => m.name === name)?.data ?? [];
  return metric.map(({ timestamp, value }) => {
    return {
      // API returns timestamps in microseconds
      timestamp: timestamp / 1000,
      value: parseFloat(value),
    };
  });
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
