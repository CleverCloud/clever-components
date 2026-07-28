import { GetGrafanaCommand } from '@clevercloud/client/cc-api-commands/grafana/get-grafana-command.js';
import { tolerateNotFound } from '@clevercloud/client/utils/error-utils.js';
import { getDevHubUrl } from '../../lib/dev-hub-url.js';

/**
 * @import { CcApiClient } from '@clevercloud/client/cc-api-client.js'
 * @import { AddonInfoStateLoaded } from './cc-addon-info.types.js'
 * @import { CheckKeycloakVersionCommandOutput } from '@clevercloud/client/cc-api-commands/keycloak/check-keycloak-version-command.types.js'
 * @import { CheckOtoroshiVersionCommandOutput } from '@clevercloud/client/cc-api-commands/otoroshi/check-otoroshi-version-command.types.js'
 * @import { CheckMetabaseVersionCommandOutput } from '@clevercloud/client/cc-api-commands/metabase/check-metabase-version-command.types.js'
 */

/**
 * @param {CheckKeycloakVersionCommandOutput | CheckOtoroshiVersionCommandOutput | CheckMetabaseVersionCommandOutput} operatorVersionInfo
 * @returns {AddonInfoStateLoaded['version']}
 **/
export function formatVersionState(operatorVersionInfo) {
  if (operatorVersionInfo.needUpdate) {
    return {
      stateType: 'update-available',
      installed: operatorVersionInfo.installed,
      available: operatorVersionInfo.availableVersions.filter((version) => version !== operatorVersionInfo.installed),
      latest: operatorVersionInfo.latest,
      changelogLink: `${getDevHubUrl('/changelog')}`,
    };
  }

  return {
    stateType: 'up-to-date',
    installed: operatorVersionInfo.installed,
    latest: operatorVersionInfo.latest,
  };
}

/**
 * Resolves the Grafana app link for an addon.
 *
 * - If `grafanaLink` is `null` (Grafana disabled in the console), returns `null`.
 * - If the Grafana org exists, builds a dashboard URL with the given `dashboardPath` and `appId`.
 * - If the Grafana org does not exist, falls back to `grafanaLink.console`.
 *
 * @param {object} params
 * @param {{ base: string, console: string } | null} params.grafanaLink
 * @param {string} params.ownerId
 * @param {string} params.dashboardPath - Grafana dashboard path (e.g. '/d/runtime/application-runtime')
 * @param {string} params.appId - Value for the `var-SELECT_APP` query parameter
 * @param {CcApiClient} params.ccApiClient
 * @param {AbortSignal} params.signal
 * @returns {Promise<string | null>}
 */
export async function getGrafanaAppLink({ grafanaLink, ownerId, dashboardPath, appId, ccApiClient, signal }) {
  if (grafanaLink == null) {
    return null;
  }

  const grafanaOrg = await tolerateNotFound(ccApiClient.send(new GetGrafanaCommand({ ownerId }), { signal }));

  if (grafanaOrg != null) {
    const url = new URL(dashboardPath, grafanaLink.base);
    url.searchParams.set('orgId', String(grafanaOrg.id));
    url.searchParams.set('var-SELECT_APP', appId);
    return url.toString();
  }

  return grafanaLink.console;
}
