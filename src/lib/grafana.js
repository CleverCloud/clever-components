import { sendToApi } from './send-to-api.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getGrafanaOrganisation } from '@clevercloud/client/esm/api/v4/saas.js';

/**
 * @typedef {import('./send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {object} GrafanaLinkData - The Grafana link data.
 * @property {string} base - The base URL for Grafana.
 * @property {string} console - The fallback console Grafana URL.
 */

/**
 * Fetches the direct Grafana application link for a given organization and application.
 * If the organization has Grafana enabled, it returns a direct link to the application's dashboard.
 * If the API call fails (e.g., Grafana is not enabled), it returns a fallback link to the console.
 *
 * @param {object} settings
 * @param {ApiConfig} settings.apiConfig - The API configuration.
 * @param {string} settings.ownerId - The owner ID of the application.
 * @param {string} settings.appId - The application ID.
 * @param {GrafanaLinkData} settings.grafanaLinkData - The Grafana link configuration.
 * @param {AbortSignal} settings.signal - The abort signal for the fetch request.
 * @returns {Promise<string>} A promise that resolves with the Grafana URL.
 */
export function getGrafanaLink({ apiConfig, ownerId, appId, grafanaLinkData, signal }) {
  return getGrafanaOrganisation({ id: ownerId })
    .then(sendToApi({ apiConfig, signal }))
    .then(
      /** @param {{id: string}} grafanaOrg */
      (grafanaOrg) => {
        const grafanaLinkUrl = new URL('/d/runtime/application-runtime', grafanaLinkData.base);
        grafanaLinkUrl.searchParams.set('orgId', grafanaOrg.id);
        grafanaLinkUrl.searchParams.set('var-SELECT_APP', appId);
        return grafanaLinkUrl.toString();
      },
    )
    .catch(() => {
      // If Grafana is not enabled for the user, we fallback to the Console Grafana page.
      return Promise.resolve(grafanaLinkData.console);
    });
}
