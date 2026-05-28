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
  const to = new Date();
  to.setHours(to.getHours() - 1, 0, 0, 0);

  const data = await getCcApiClientWithOAuth(apiConfig).send(
    new GetStatusCodeDistributionCommand({
      ownerId,
      applicationId: appId,
      to,
    }),
    { signal },
  );

  return data.byDate.map((entry) => {
    const time = new Date(entry.date).getTime();
    return [time, time + 1000 * 60 * 60 - 1, entry.total];
  });
}
