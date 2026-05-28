import { GetStatusCodeDistributionCommand } from '@clevercloud/client/cc-api-commands/metrics/get-status-code-distribution-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-tile-status-codes.js';

/**
 * @import { CcTileStatusCodes } from './cc-tile-status-codes.js'
 * @import { StatusCodesData } from './cc-tile-status-codes.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-tile-status-codes',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs<CcTileStatusCodes>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, appId } = context;

    updateComponent('state', { type: 'loading' });

    fetchStatusCodes({ apiConfig, signal, ownerId, appId })
      .then((statusCodes) => {
        updateComponent('state', { type: 'loaded', statusCodes });
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
 * @return {Promise<StatusCodesData>}
 */
async function fetchStatusCodes({ apiConfig, signal, ownerId, appId }) {
  const data = await getCcApiClientWithOAuth(apiConfig).send(
    new GetStatusCodeDistributionCommand({
      ownerId,
      applicationId: appId,
      excludeNonStandardStatusCodes: true,
    }),
    { signal },
  );

  return data.byStatusCode.statuses;
}
