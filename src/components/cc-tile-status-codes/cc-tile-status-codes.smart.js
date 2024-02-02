import './cc-tile-status-codes.js';
import '../cc-smart-container/cc-smart-container.js';
import { getStatusCodesFromWarp10 } from '@clevercloud/client/esm/access-logs.js';
import { getWarp10AccessLogsToken } from '@clevercloud/client/esm/api/v2/warp-10.js';
import { THIRTY_SECONDS } from '@clevercloud/client/esm/request.fetch-with-timeout.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { sendToApi, sendToWarp } from '../../lib/send-to-api.js';

defineSmartComponent({
  selector: 'cc-tile-status-codes',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String, required: false },
  },
  onContextUpdate ({ context, updateComponent, signal }) {
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

async function fetchStatusCodes ({ apiConfig, signal, ownerId, appId }) {
  const warpToken = await getWarp10AccessLogsToken({ orgaId: ownerId })
    .then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }));
  return getStatusCodesFromWarp10({ warpToken, ownerId, appId })
    .then(sendToWarp({ apiConfig, signal, timeout: THIRTY_SECONDS }));
}
