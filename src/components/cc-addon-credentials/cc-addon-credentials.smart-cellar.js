import { GetCellarCredentialsCommand } from '@clevercloud/client/cc-api-commands/cellar/get-cellar-credentials-command.js';
import { GetCellarCredentialsPresignedUrlCommand } from '@clevercloud/client/cc-api-commands/cellar/get-cellar-credentials-presigned-url-command.js';
import { RenewCellarCredentialsCommand } from '@clevercloud/client/cc-api-commands/cellar/renew-cellar-credentials-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-credentials.js';

/** @type {AddonCredentialsStateLoading} */
const LOADING_STATE = {
  type: 'loading',
  tabs: {
    default: {
      content: [
        {
          code: 'host',
          value: 'fake-skeleton',
        },
        {
          code: 'key-id',
          value: 'fake-skeleton',
        },
        {
          code: 'key-secret',
          value: 'fake-skeleton',
        },
        {
          code: 'download-file',
          value: 'fake-skeleton',
        },
      ],
    },
  },
};

/**
 * @import { CcAddonCredentials } from './cc-addon-credentials.js'
 * @import { AddonCredentialsStateLoaded, AddonCredentialsStateLoading } from './cc-addon-credentials.types.js'
 * @import { AddonCredential } from '../cc-addon-credentials-content/cc-addon-credentials-content.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-credentials[smart-mode="cellar"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonCredentials>} args
   */
  onContextUpdate({ context, updateComponent, onEvent, signal }) {
    const { apiConfig, addonId, ownerId } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    /**
     * @returns {Promise<AddonCredential[]>}
     */
    function getAllCredentials() {
      return Promise.all([
        ccApiClient.send(new GetCellarCredentialsCommand({ ownerId, addonId }), { signal }),
        ccApiClient.send(new GetCellarCredentialsPresignedUrlCommand({ ownerId, addonId }), { signal }),
      ]).then(([credentials, presignedUrl]) => {
        return [
          {
            code: 'host',
            value: credentials.host,
          },
          {
            code: 'key-id',
            value: credentials.keyId,
          },
          {
            code: 'key-secret',
            value: credentials.keySecret,
          },
          {
            code: 'download-file',
            value: presignedUrl.url,
          },
        ];
      });
    }

    updateComponent('state', LOADING_STATE);

    getAllCredentials()
      .then((credentials) => {
        updateComponent(
          'state',
          /** @param {AddonCredentialsStateLoaded|AddonCredentialsStateLoading} state */
          (state) => {
            state.type = 'loaded';
            state.tabs.default.content = credentials;
          },
        );
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-addon-credentials-renew-secret', async () => {
      updateComponent('state', (state) => {
        state.type = 'waiting';
      });

      try {
        await ccApiClient.send(new RenewCellarCredentialsCommand({ ownerId, addonId }));
      } catch (error) {
        console.error(error);
        notifyError(i18n('cc-addon-credentials.renew-secret.error'));
        updateComponent('state', (state) => {
          state.type = 'loaded';
        });
        return;
      }

      try {
        const credentials = await getAllCredentials();
        notifySuccess(i18n('cc-addon-credentials.renew-secret.success'));
        updateComponent(
          'state',
          /** @param {AddonCredentialsStateLoaded|AddonCredentialsStateLoading} state */
          (state) => {
            state.type = 'loaded';
            state.tabs.default.content = credentials;
          },
        );
      } catch (error) {
        console.error(error);
        notifySuccess(i18n('cc-addon-credentials.renew-secret.success'));
        notifyError(i18n('cc-addon-credentials.get-credentials.error'));
        updateComponent('state', (state) => {
          state.type = 'loaded';
        });
      }
    });
  },
});
