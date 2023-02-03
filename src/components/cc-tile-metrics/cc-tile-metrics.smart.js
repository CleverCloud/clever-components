import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { getAppMetrics, getGrafanaOrganisation } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-tile-metrics.js';

defineSmartComponent({
  selector: 'cc-tile-metrics',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
    grafanaBaseLink: { type: String },
    consoleBaseLink: { type: String },
  },
  onContextUpdate ({ component, context, onEvent, updateComponent, signal }) {

    const { apiConfig, ownerId, appId, grafanaBaseLink, consoleBaseLink } = context;

    updateComponent('metrics', { state: 'loading' });

    const metricsAppLink = getMetricsLink({ ownerId, appId, consoleBaseLink });
    updateComponent('metricsLink', metricsAppLink);

    fetchMetrics({ apiConfig, ownerId, appId, signal })
      .then(({ cpuData, memData }) => {
        if (cpuData.length === 0 || memData.length === 0) {
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
      .catch((error) => {
        console.error(error);
        // TODO: find a way to remove console logic from this
        const pathname = ownerId.startsWith('user_')
          ? '/users/me/grafana'
          : `/organisations/${ownerId}/grafana`;
        const grafanaAppLink = new URL(pathname, consoleBaseLink).toString();
        updateComponent('grafanaLink', grafanaAppLink);
      });
  },
});

function fetchMetrics ({ apiConfig, ownerId, appId, signal }) {
  return getAppMetrics({ id: ownerId, appId })
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
      timestamp,
      value: parseFloat(value),
    };
  });
}

function fetchGrafanaAppLink ({ apiConfig, ownerId, appId, grafanaBaseLink, signal }) {
  return getGrafanaOrganisation({ id: ownerId })
    .then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }))
    .then((grafanaOrg) => {
      const grafanaLink = new URL('/d/runtime/application-runtime', grafanaBaseLink);
      grafanaLink.searchParams.set('orgId', grafanaOrg.id);
      grafanaLink.searchParams.set('var-SELECT_APP', appId);
      return grafanaLink.toString();
    });
}

function getMetricsLink ({ ownerId, appId, consoleBaseLink }) {
  const pathname = ownerId.startsWith('user_')
    ? `/users/me/applications/${appId}/metrics/global`
    : `/organisations/${ownerId}/applications/${appId}/metrics/global`;
  return new URL(pathname, consoleBaseLink).toString();
}
