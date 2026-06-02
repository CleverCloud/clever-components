import { CreateOtoroshiNetworkGroupCommand } from '@clevercloud/client/cc-api-commands/otoroshi/create-otoroshi-network-group-command.js';
import { DeleteOtoroshiNetworkGroupCommand } from '@clevercloud/client/cc-api-commands/otoroshi/delete-otoroshi-network-group-command.js';
import { GetOtoroshiInfoCommand } from '@clevercloud/client/cc-api-commands/otoroshi/get-otoroshi-info-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { fakeString } from '../../lib/fake-strings.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-credentials.js';

/** @type {AddonCredentialsStateLoading} */
const LOADING_STATE = {
  type: 'loading',
  tabs: {
    admin: {
      content: [
        {
          code: 'user',
          value: fakeString(10),
        },
        {
          code: 'password',
          value: fakeString(10),
        },
        {
          code: 'ng',
          kind: 'standard',
          value: { status: 'disabled' },
        },
      ],
      docLink: {
        text: i18n('cc-addon-credentials.doc-link.otoroshi-ng'),
        href: getDocUrl('/addons/otoroshi/#use-otoroshi-in-a-network-group'),
      },
    },
    api: {
      content: [
        {
          code: 'api-client-user',
          value: fakeString(10),
        },
        {
          code: 'api-client-secret',
          value: fakeString(10),
        },
        {
          code: 'api-url',
          value: fakeString(10),
        },
        {
          code: 'swagger-url',
          value: fakeString(10),
        },
        {
          code: 'ng',
          kind: 'standard',
          value: { status: 'disabled' },
        },
      ],
      docLink: {
        text: i18n('cc-addon-credentials.doc-link.otoroshi-api'),
        href: getDocUrl('/addons/otoroshi/#manage-otoroshi-from-its-api'),
      },
    },
  },
};

/**
 * @import { CcAddonCredentials } from './cc-addon-credentials.js'
 * @import { AddonCredentialsStateLoaded, AddonCredentialsStateLoading } from './cc-addon-credentials.types.js'
 * @import { AddonCredential, AddonCredentialNg, AddonCredentialNgEnabled, AddonCredentialNgDisabled } from '../cc-addon-credentials-content/cc-addon-credentials-content.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-credentials[smart-mode="otoroshi"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonCredentials>} args
   */
  onContextUpdate({ context, onEvent, updateComponent, signal }) {
    const { apiConfig, addonId } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    /** @param {AddonCredentialNg|((param: AddonCredentialNg) => AddonCredential)} newNgInfoOrCallback */
    function updateNg(newNgInfoOrCallback) {
      updateComponent(
        'state',
        /** @param {AddonCredentialsStateLoaded} state */
        (state) => {
          state.tabs = Object.fromEntries(
            Object.entries(state.tabs).map(([tabName, tabValue]) => [
              tabName,
              {
                ...tabValue,
                content: tabValue.content.map((addonInfo) => {
                  if (addonInfo.code === 'ng') {
                    if (typeof newNgInfoOrCallback === 'function') {
                      return newNgInfoOrCallback(addonInfo);
                    } else {
                      return newNgInfoOrCallback;
                    }
                  }
                  return addonInfo;
                }),
              },
            ]),
          );
        },
      );
    }

    updateComponent('state', LOADING_STATE);

    ccApiClient
      .send(new GetOtoroshiInfoCommand({ addonId }), { signal })
      .then((operator) => {
        /** @type {AddonCredential[]} */
        const adminCredentials = [
          { code: 'user', value: operator.initialCredentials.user },
          { code: 'password', value: operator.initialCredentials.password },
          { code: 'ng', kind: 'standard', value: formatNgData(operator.features.networkGroup) },
        ];

        /** @type {AddonCredential[]} */
        const apiCredentials = [
          { code: 'api-client-user', value: operator.api.user },
          { code: 'api-client-secret', value: operator.api.secret },
          { code: 'api-url', value: operator.api.url },
          { code: 'swagger-url', value: operator.api.swaggerUrl },
          { code: 'ng', kind: 'standard', value: formatNgData(operator.features.networkGroup) },
        ];

        updateComponent(
          'state',
          /** @param {AddonCredentialsStateLoaded|AddonCredentialsStateLoading} state */
          (state) => {
            state.type = 'loaded';
            state.tabs = Object.fromEntries(
              Object.entries(state.tabs).map(([tabName, tabValue]) => [
                tabName,
                {
                  ...tabValue,
                  content: tabName === 'api' ? apiCredentials : adminCredentials,
                },
              ]),
            );
          },
        );
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-ng-enable', () => {
      updateNg({
        code: 'ng',
        kind: 'standard',
        value: {
          status: 'enabling',
        },
      });

      ccApiClient
        .send(new CreateOtoroshiNetworkGroupCommand({ addonId }))
        .then((updatedOperator) => {
          updateNg({
            code: 'ng',
            kind: 'standard',
            value: {
              status: 'enabled',
              id: updatedOperator.features.networkGroup.id,
            },
          });

          notifySuccess(i18n('cc-addon-credentials.ng-standard.enabling.success'));
        })
        .catch((error) => {
          console.error(error);
          updateNg({
            code: 'ng',
            kind: 'standard',
            value: {
              status: 'disabled',
            },
          });
          notifyError(i18n('cc-addon-credentials.ng-standard.enabling.error'));
        });
    });

    onEvent('cc-ng-disable', () => {
      updateNg((addonInfo) => ({
        code: 'ng',
        kind: 'standard',
        value: {
          id: /** @type {AddonCredentialNgEnabled} */ (addonInfo.value).id,
          status: 'disabling',
        },
      }));

      ccApiClient
        .send(new DeleteOtoroshiNetworkGroupCommand({ addonId }))
        .then(() => {
          updateNg({
            code: 'ng',
            kind: 'standard',
            value: {
              status: 'disabled',
            },
          });
          notifySuccess(i18n('cc-addon-credentials.ng-standard.disabling.success'));
        })
        .catch((error) => {
          console.error(error);
          updateNg((addonInfo) => ({
            code: 'ng',
            kind: 'standard',
            value: {
              id: /** @type {AddonCredentialNgEnabled} */ (addonInfo.value).id,
              status: 'enabled',
            },
          }));
          notifyError(i18n('cc-addon-credentials.ng-standard.disabling.error'));
        });
    });
  },
});

/**
 *
 * @param {{ id: string } | null} data
 * @returns {AddonCredentialNgEnabled | AddonCredentialNgDisabled}
 */
function formatNgData(data) {
  if (data == null) {
    return { status: 'disabled' };
  }

  return {
    status: 'enabled',
    id: data.id,
  };
}
