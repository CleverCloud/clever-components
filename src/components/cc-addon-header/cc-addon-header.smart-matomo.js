import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { GetMatomoInfoCommand } from '@clevercloud/client/cc-api-commands/matomo/get-matomo-info-command.js';
import { RebootMatomoCommand } from '@clevercloud/client/cc-api-commands/matomo/reboot-matomo-command.js';
import { RebuildMatomoCommand } from '@clevercloud/client/cc-api-commands/matomo/rebuild-matomo-command.js';
import { GetZoneCommand } from '@clevercloud/client/cc-api-commands/zone/get-zone-command.js';
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { fakeString } from '../../lib/fake-strings.js';
import { notify, notifyError } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-header.js';

const DOCS_URL = getDocUrl(`/addons/matomo`);

/**
 * @import { CcAddonHeader } from './cc-addon-header.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-header[smart-mode=matomo]',
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
      productStatus,
    });

    ccApiClient
      .send(new GetAddonCommand({ ownerId, addonId }), { signal, dedupe: true, cache: { ttl: ONE_SECOND } })
      .then((addon) => {
        return Promise.all([
          addon,
          ccApiClient.send(new GetMatomoInfoCommand({ addonId }), { signal, dedupe: true, cache: { ttl: ONE_SECOND } }),
          ccApiClient.send(new GetZoneCommand({ zoneName: addon.zone, ownerId }), { signal }),
        ]);
      })
      .then(([addon, operator, zone]) => {
        const phpAppId = operator.resources.entrypoint;
        logsUrl = context.logsUrlPattern.replace(':id', phpAppId);

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
              name: 'MATOMO',
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
        .send(new RebootMatomoCommand({ addonId }))
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
        .send(new RebuildMatomoCommand({ addonId }))
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
