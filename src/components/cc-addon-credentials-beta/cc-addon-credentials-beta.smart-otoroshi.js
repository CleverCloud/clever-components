import { getDocUrl } from '../../lib/dev-hub-url.js';
import { fakeString } from '../../lib/fake-strings.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonCredentialsBetaClient } from './cc-addon-credentials-beta.client.js';
import './cc-addon-credentials-beta.js';

/** @type {AddonCredentialsBetaStateLoading} */
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
        text: i18n('cc-addon-credentials-beta.doc-link.otoroshi-ng'),
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
          code: 'open-api-url',
          value: fakeString(10),
        },
        {
          code: 'ng',
          kind: 'standard',
          value: { status: 'disabled' },
        },
      ],
      docLink: {
        text: i18n('cc-addon-credentials-beta.doc-link.otoroshi-api'),
        href: getDocUrl('/addons/otoroshi/#manage-otoroshi-from-its-api'),
      },
    },
  },
};
const PROVIDER_ID = 'otoroshi';

/**
 * @import { CcAddonCredentialsBeta } from './cc-addon-credentials-beta.js'
 * @import { AddonCredentialsBetaStateLoaded, AddonCredentialsBetaStateLoading } from './cc-addon-credentials-beta.types.js'
 * @import { OtoroshiOperatorInfo } from '../../operators.types.js'
 * @import { AddonCredential, AddonCredentialNg, AddonCredentialNgEnabled, AddonCredentialNgDisabled } from '../cc-addon-credentials-content/cc-addon-credentials-content.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-credentials-beta[smart-mode="otoroshi"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonCredentialsBeta>} args
   */
  onContextUpdate({ context, onEvent, updateComponent, signal }) {
    const { apiConfig, addonId, ownerId } = context;
    const api = new Api({ apiConfig, ownerId, addonId, signal });

    /** @param {AddonCredentialNg|((param: AddonCredentialNg) => AddonCredential)} newNgInfoOrCallback */
    function updateNg(newNgInfoOrCallback) {
      updateComponent(
        'state',
        /** @param {AddonCredentialsBetaStateLoaded} state */
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

    api
      .getAllCredentials()
      .then((tabs) => {
        updateComponent(
          'state',
          /** @param {AddonCredentialsBetaStateLoaded|AddonCredentialsBetaStateLoading} state */
          (state) => {
            state.type = 'loaded';
            state.tabs = Object.fromEntries(
              Object.entries(state.tabs).map(([tabName, tabValue]) => [
                tabName,
                {
                  ...tabValue,
                  content: tabs[/** @type {'admin'|'api'} */ (tabName)],
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

      api
        .createNg()
        .then((updatedOperator) => {
          updateNg({
            code: 'ng',
            kind: 'standard',
            value: {
              status: 'enabled',
              id: updatedOperator.features.networkGroup.id,
            },
          });

          notifySuccess(i18n('cc-addon-credentials-beta.ng-standard.enabling.success'));
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
          notifyError(i18n('cc-addon-credentials-beta.ng-standard.enabling.error'));
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

      api
        .deleteNg()
        .then(() => {
          updateNg({
            code: 'ng',
            kind: 'standard',
            value: {
              status: 'disabled',
            },
          });
          notifySuccess(i18n('cc-addon-credentials-beta.ng-standard.disabling.success'));
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
          notifyError(i18n('cc-addon-credentials-beta.ng-standard.disabling.error'));
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

class Api extends CcAddonCredentialsBetaClient {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @param {AbortSignal} params.signal
   */
  constructor({ apiConfig, ownerId, addonId, signal }) {
    super({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, signal });
  }

  /**
   * @param {'admin' | 'api'} tabType
   * @return {Promise<AddonCredential[]>}
   */
  async getCredentials(tabType) {
    const operator = /** @type {OtoroshiOperatorInfo} */ (await this.getAddonWithOperator());
    if (tabType === 'api') {
      return [
        {
          code: 'api-client-user',
          value: operator.api.user,
        },
        {
          code: 'api-client-secret',
          value: operator.api.secret,
        },
        {
          code: 'api-url',
          value: operator.api.url,
        },
        {
          code: 'open-api-url',
          value: operator.api.openapi,
        },
        {
          code: 'ng',
          kind: 'standard',
          value: formatNgData(operator.features.networkGroup),
        },
      ];
    }

    return [
      {
        code: 'user',
        value: operator.initialCredentials.user,
      },
      {
        code: 'password',
        value: operator.initialCredentials.password,
      },
      {
        code: 'ng',
        kind: 'standard',
        value: formatNgData(operator.features.networkGroup),
      },
    ];
  }

  /**
   * @return {Promise<{admin: AddonCredential[], api: AddonCredential[]}>}
   */
  async getAllCredentials() {
    const [adminCredentials, apiCredentials] = await Promise.all([
      this.getCredentials('admin'),
      this.getCredentials('api'),
    ]);

    return {
      admin: adminCredentials,
      api: apiCredentials,
    };
  }
}
