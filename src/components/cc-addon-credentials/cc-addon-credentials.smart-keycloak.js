import { getDocUrl } from '../../lib/dev-hub-url.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonCredentialsClient } from './cc-addon-credentials.client.js';
import './cc-addon-credentials.js';

/** @type {AddonCredentialsStateLoading} */
const LOADING_STATE = {
  type: 'loading',
  tabs: {
    default: {
      content: [
        {
          code: 'user',
          value: 'fake-skeleton',
        },
        {
          code: 'password',
          value: 'fake-skeleton',
        },
        {
          code: 'ng',
          kind: 'multi-instances',
          value: {
            status: 'disabled',
          },
        },
      ],
      docLink: {
        text: i18n('cc-addon-credentials.doc-link.keycloak'),
        href: getDocUrl('/addons/keycloak/#secured-multi-instances'),
      },
    },
  },
};
const PROVIDER_ID = 'keycloak';

/**
 * @import { CcAddonCredentials } from './cc-addon-credentials.js'
 * @import { AddonCredentialsStateLoaded, AddonCredentialsStateLoading } from './cc-addon-credentials.types.js'
 * @import { AddonCredential, AddonCredentialNg, AddonCredentialNgEnabled, AddonCredentialNgDisabled } from '../cc-addon-credentials-content/cc-addon-credentials-content.types.js'
 * @import { KeycloakOperatorInfo } from '../../operators.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-credentials[smart-mode="keycloak"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonCredentials>} args
   */
  onContextUpdate({ context, onEvent, updateComponent, signal }) {
    const { apiConfig, addonId, ownerId } = context;
    const api = new Api({ apiConfig, ownerId, addonId, signal });

    /** @param {AddonCredentialNg|((param: AddonCredentialNg) => AddonCredential)} newNgInfoOrCallback */
    function updateNg(newNgInfoOrCallback) {
      updateComponent(
        'state',
        /** @param {AddonCredentialsStateLoaded} state */
        (state) => {
          state.tabs.default.content = [...state.tabs.default.content].map((addonInfo) => {
            if (addonInfo.code === 'ng') {
              if (typeof newNgInfoOrCallback === 'function') {
                return newNgInfoOrCallback(addonInfo);
              } else {
                return newNgInfoOrCallback;
              }
            }
            return addonInfo;
          });
        },
      );
    }

    updateComponent('state', LOADING_STATE);

    api
      .getCredentials()
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

    onEvent('cc-ng-enable', () => {
      updateNg({
        code: 'ng',
        kind: 'multi-instances',
        value: {
          status: 'enabling',
        },
      });

      api
        .createNg()
        .then((updatedOperator) => {
          updateNg({
            code: 'ng',
            kind: 'multi-instances',
            value: {
              status: 'enabled',
              id: updatedOperator.features.networkGroup.id,
            },
          });

          notifySuccess(i18n('cc-addon-credentials.ng-multi-instances.enabling.success'));
        })
        .catch((error) => {
          console.error(error);
          updateNg({
            code: 'ng',
            kind: 'multi-instances',
            value: {
              status: 'disabled',
            },
          });
          notifyError(i18n('cc-addon-credentials.ng-multi-instances.enabling.error'));
        });
    });

    onEvent('cc-ng-disable', () => {
      updateNg((addonInfo) => ({
        code: 'ng',
        kind: 'multi-instances',
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
            kind: 'multi-instances',
            value: {
              status: 'disabled',
            },
          });
          notifySuccess(i18n('cc-addon-credentials.ng-multi-instances.disabling.success'));
        })
        .catch((error) => {
          console.error(error);
          updateNg((addonInfo) => ({
            code: 'ng',
            kind: 'multi-instances',
            value: {
              id: /** @type {AddonCredentialNgEnabled} */ (addonInfo.value).id,
              kind: 'multi-instances',
              status: 'enabled',
            },
          }));
          notifyError(i18n('cc-addon-credentials.ng-multi-instances.disabling.error'));
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

class Api extends CcAddonCredentialsClient {
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
   * @return {Promise<AddonCredential[]>}
   */
  async getCredentials() {
    const operator = /** @type {KeycloakOperatorInfo} */ (await this.getAddonWithOperator());
    return [
      {
        code: 'initial-user',
        value: operator.initialCredentials.user,
      },
      {
        code: 'initial-password',
        value: operator.initialCredentials.password,
      },
      {
        code: 'ng',
        kind: 'multi-instances',
        value: formatNgData(operator.features.networkGroup),
      },
    ];
  }
}
