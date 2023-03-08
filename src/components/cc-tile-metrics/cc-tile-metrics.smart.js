import { getAppMetrics, getGrafanaOrganisation } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-tile-metrics.js';

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
  onContextUpdate ({ component, context, onEvent, updateComponent, signal }) {

    const { apiConfig, ownerId, appId, grafanaBaseLink, consoleGrafanaLink } = context;

    updateComponent('metrics', { state: 'loading' });

    fetchMetrics({ apiConfig, ownerId, appId, signal })
      .then(({ cpuData, memData }) => {
        if (cpuData.length === 0 || memData.length === 0 || isAppStopped(cpuData)) {
          updateComponent('metrics', { state: 'empty' });
        }
        else {
          updateComponent('metrics', { state: 'loaded', value: { cpuData, memData } });
        }
      })
      .catch((error) => {
        console.error(error);
        updateComponent('metrics', { state: 'error' });
      });

    fetchGrafanaAppLink({ apiConfig, ownerId, appId, grafanaBaseLink, signal })
      .then((grafanaAppLink) => {
        updateComponent('grafanaLink', grafanaAppLink);
      })
      .catch(() => {
        // If Grafana is not enabled we fallback to the Console Grafana page
        updateComponent('grafanaLink', consoleGrafanaLink);
      });
  },
});

function fetchMetrics ({ apiConfig, ownerId, appId, signal }) {
  return getAppMetrics({ id: ownerId, appId, interval: 'P1D', span: 'PT1H' })
    .then(sendToApi({ apiConfig, signal }))
    .then((metrics) => {
      const cpuData = extractMetric(metrics, 'cpu');
      const memData = extractMetric(metrics, 'mem');
      return { cpuData, memData };
    });
}

function extractMetric (metrics, name) {
  const metric = metrics?.find((m) => m.name === name)?.data ?? [];
  return metric.map(({ timestamp, value }) => {
    return {
      // API returns timestamps in microseconds
      timestamp: timestamp / 1000,
      value: parseFloat(value),
    };
  });
}

function fetchGrafanaAppLink ({ apiConfig, ownerId, appId, grafanaBaseLink, signal }) {
  return getGrafanaOrganisation({ id: ownerId })
    .then(sendToApi({ apiConfig, signal }))
    .then((grafanaOrg) => {
      const grafanaLink = new URL('/d/runtime/application-runtime', grafanaBaseLink);
      grafanaLink.searchParams.set('orgId', grafanaOrg.id);
      grafanaLink.searchParams.set('var-SELECT_APP', appId);
      return grafanaLink.toString();
    });
}

function isAppStopped (data) {
  return data.filter((data) => parseFloat(data.value) === 0).length === NUMBER_OF_POINTS;
}
