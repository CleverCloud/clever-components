import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { GetKeycloakInfoCommand } from '@clevercloud/client/cc-api-commands/keycloak/get-keycloak-info-command.js';
import { RebootKeycloakCommand } from '@clevercloud/client/cc-api-commands/keycloak/reboot-keycloak-command.js';
import { RebuildKeycloakCommand } from '@clevercloud/client/cc-api-commands/keycloak/rebuild-keycloak-command.js';
import { GetZoneCommand } from '@clevercloud/client/cc-api-commands/zone/get-zone-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { fakeString } from '../../lib/fake-strings.js';
import { notify, notifyError } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-header.js';

const DOCS_URL = getDocUrl(`/addons/keycloak`);

/**
 * @import { CcAddonHeader } from './cc-addon-header.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-header[smart-mode=keycloak]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    logsUrlPattern: { type: String },
    productStatus: { type: String, optional: true },
  },

  /** @param {OnContextUpdateArgs<CcAddonHeader>} args */
  onContextUpdate({ context, updateComponent, onEvent, signal }) {
    const { apiConfig, ownerId, addonId, productStatus } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);
    let logsUrl = '';

    updateComponent('state', {
      type: 'loading',
      logsUrl: fakeString(15),
      openLinks: [
        {
          url: fakeString(15),
          name: fakeString(5),
        },
      ],
      actions: {
        restart: true,
        rebuildAndRestart: true,
      },
      productStatus: fakeString(4),
    });

    ccApiClient
      .send(new GetAddonCommand({ ownerId, addonId }), { signal })
      .then((addon) => {
        return Promise.all([
          addon,
          ccApiClient.send(new GetKeycloakInfoCommand({ addonId }), { signal }),
          ccApiClient.send(new GetZoneCommand({ zoneName: addon.zone, ownerId }), { signal }),
        ]);
      })
      .then(([addon, operator, zone]) => {
        const javaAppId = operator.resources.entrypoint;
        logsUrl = context.logsUrlPattern.replace(':id', javaAppId);

        updateComponent('state', {
          type: 'loaded',
          providerId: addon.provider.name,
          providerLogoUrl: addon.provider.logoUrl,
          name: addon.name,
          id: addon.realId,
          zone,
          logsUrl,
          openLinks: [
            {
              name: 'KEYCLOAK',
              url: operator.accessUrl,
            },
          ],
          actions: {
            restart: true,
            rebuildAndRestart: true,
          },
          productStatus,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', {
          type: 'error',
        });
      });

    onEvent('cc-addon-restart', () => {
      updateComponent('state', (state) => {
        state.type = 'restarting';
      });

      ccApiClient
        .send(new RebootKeycloakCommand({ addonId }))
        .then(() => {
          notify({
            intent: 'success',
            message: i18n('cc-addon-header.restart.success.message', { logsUrl, docsUrl: DOCS_URL }),
            title: i18n('cc-addon-header.restart.success.title'),
            options: {
              timeout: 0,
              closeable: true,
            },
          });
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-addon-header.restart.error'));
        })
        .finally(() => {
          updateComponent('state', (state) => {
            state.type = 'loaded';
          });
        });
    });

    onEvent('cc-addon-rebuild', () => {
      updateComponent('state', (state) => {
        state.type = 'rebuilding';
      });

      ccApiClient
        .send(new RebuildKeycloakCommand({ addonId }))
        .then(() => {
          notify({
            intent: 'success',
            message: i18n('cc-addon-header.rebuild.success.message', { logsUrl, docsUrl: DOCS_URL }),
            title: i18n('cc-addon-header.rebuild.success.title'),
            options: {
              timeout: 0,
              closeable: true,
            },
          });
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-addon-header.rebuild.error'));
        })
        .finally(() => {
          updateComponent('state', (state) => {
            state.type = 'loaded';
          });
        });
    });
  },
});
