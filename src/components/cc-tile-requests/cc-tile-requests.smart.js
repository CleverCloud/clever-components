import { GetStatusCodeDistributionCommand } from '@clevercloud/client/cc-api-commands/metrics/get-status-code-distribution-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-tile-requests.js';

/**
 * @import { CcTileRequests } from './cc-tile-requests.js'
 * @import { RequestsData } from './cc-tile-requests.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

const ONE_HOUR = 1000 * 60 * 60;

defineSmartComponent({
  selector: 'cc-tile-requests',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs<CcTileRequests>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, appId } = context;

    updateComponent('state', { type: 'loading' });

    fetchRequests({ apiConfig, signal, ownerId, appId })
      .then((data) => {
        updateComponent('state', { type: 'loaded', data });
      })
      .catch((error) => {
        console.log(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

/**
 * @param {Object} settings
 * @param {ApiConfig} settings.apiConfig
 * @param {AbortSignal} settings.signal
 * @param {string} settings.ownerId
 * @param {string} settings.appId
 * @return {Promise<Array<RequestsData>>}
 */
async function fetchRequests({ apiConfig, signal, ownerId, appId }) {
  // Omitting `from`/`to` lets the API default to the last 24 whole hours ending at the current hour.
  const data = await getCcApiClientWithOAuth(apiConfig).send(
    new GetStatusCodeDistributionCommand({
      ownerId,
      applicationId: appId,
    }),
    { signal },
  );

  return data.byDate.map((entry) => {
    // The API dates each bucket with its end boundary, the tile expects its start.
    const end = new Date(entry.date).getTime();
    return [end - ONE_HOUR, end - 1, entry.total];
  });
}
