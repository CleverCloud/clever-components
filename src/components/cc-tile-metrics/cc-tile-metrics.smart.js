import { getAppMetrics, getGrafanaOrganisation } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-tile-metrics.js';

/**
 * @typedef {import('./cc-tile-metrics.types.js').RawMetric} RawMetric
 * @typedef {import('./cc-tile-metrics.types.js').MetricsData} MetricsData
 * @typedef {import('./cc-tile-metrics.types.js').Metric} Metric
 */

const NUMBER_OF_POINTS = 24;

defineSmartComponent({
  selector: 'cc-tile-metrics',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
    consoleGrafanaLink: { type: String },
    grafanaBaseLink: { type: String },
  },
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, ownerId, appId, grafanaBaseLink, consoleGrafanaLink } = context;

    updateComponent('state', { type: 'loading' });

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

    fetchGrafanaAppLink({ apiConfig, ownerId, appId, grafanaBaseLink, signal })
      .then((grafanaAppLink) => {
        updateComponent('grafanaLinkState', { type: 'loaded', link: grafanaAppLink });
      })
      .catch(() => {
        // If Grafana is not enabled we fallback to the Console Grafana page
        updateComponent('grafanaLinkState', { type: 'loaded', link: consoleGrafanaLink });
      });
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
  return getAppMetrics({ id: ownerId, appId, interval: 'P1D', span: 'PT1H' })
    .then(sendToApi({ apiConfig, signal }))
    .then((metrics) => {
      const cpuMetrics = extractMetric(metrics, 'cpu');
      const memMetrics = extractMetric(metrics, 'mem');
      return { cpuMetrics, memMetrics };
    });
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
    .then((grafanaOrg) => {
      const grafanaLink = new URL('/d/runtime/application-runtime', grafanaBaseLink);
      grafanaLink.searchParams.set('orgId', grafanaOrg.id);
      grafanaLink.searchParams.set('var-SELECT_APP', appId);
      return grafanaLink.toString();
    });
}

/**
 * @param {Metric[]} data
 * @returns {boolean}
 */
function isAppStopped(data) {
  return data.filter((data) => data.value === 0).length === NUMBER_OF_POINTS;
}
