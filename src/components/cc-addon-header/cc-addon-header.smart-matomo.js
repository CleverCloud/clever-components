import { getDocUrl } from '../../lib/dev-hub-url.js';
import { fakeString } from '../../lib/fake-strings.js';
import { notify, notifyError } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonHeaderClient } from './cc-addon-header.client.js';
import './cc-addon-header.js';

const DOCS_URL = getDocUrl(`/addons/matomo`);
const PROVIDER_ID = 'matomo';

/**
 * @typedef {import('./cc-addon-header.js').CcAddonHeader} CcAddonHeader
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonHeader>} OnContextUpdateArgs
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

  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ context, updateComponent, onEvent, signal }) {
    const { apiConfig, ownerId, addonId, productStatus } = context;
    const api = new CcAddonHeaderClient({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, signal });
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

    api
      .getAddonWithOperatorAndZone()
      .then(({ rawAddon, operator, zone }) => {
        const phpAppId = operator.resources.entrypoint;
        logsUrl = context.logsUrlPattern.replace(':id', phpAppId);

        updateComponent('state', {
          type: 'loaded',
          providerId: rawAddon.provider.name,
          providerLogoUrl: rawAddon.provider.logoUrl,
          name: rawAddon.name,
          id: rawAddon.realId,
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

      api
        .restartAddon()
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

      api
        .rebuildAndRestartAddon()
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
