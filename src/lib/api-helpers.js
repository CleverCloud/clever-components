import { get as getApp } from '@clevercloud/client/esm/api/v2/application.js';
import { sendToApi } from './send-to-api.js';

export function fetchApp ({ apiConfig, signal, ownerId, appId }) {
  return getApp({ id: ownerId, appId }).then(sendToApi({ apiConfig, signal }));
}
