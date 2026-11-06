import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { GetEnvironmentCommand } from '@clevercloud/client/cc-api-commands/environment/get-environment-command.js';
import { unlessAborted } from '../../lib/abortable.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-info.js';

/**
 * @import { CcAddonInfo } from './cc-addon-info.js'
 * @import { AddonInfoStateLoading } from './cc-addon-info.types.js'
 * @import { FormattedFeature } from '../common.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-info[smart-mode="redis"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonInfo>} _
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId } = context;

    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    /**
     * @type {AddonInfoStateLoading}
     */
    const LOADING_STATE = {
      type: 'loading',
      version: {
        stateType: 'up-to-date',
        installed: '0.0.0',
        latest: '0.0.0',
      },
      creationDate: '2025-08-06 15:03:00',
      specifications: [
        {
          code: 'plan',
          type: 'string',
          value: 'S',
        },
        {
          code: 'cpu',
          type: 'number',
          value: 1,
        },
        {
          code: 'disk-size',
          type: 'bytes',
          value: 134217728,
        },
        {
          code: 'connection-limit',
          type: 'number',
          value: 100,
        },
        {
          code: 'databases',
          type: 'number',
          value: 1,
        },
      ],
    };

    updateComponent('state', { type: 'loading', ...LOADING_STATE });
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.redis'),
      href: getDocUrl('/addons/redis'),
    });

    Promise.all([
      ccApiClient.send(new GetAddonCommand({ ownerId, addonId }), { signal }),
      ccApiClient.send(new GetEnvironmentCommand({ ownerId, addonId }), { signal }),
    ])
      .then(async ([addon, { environment }]) => {
        const version = environment.find((envVar) => envVar.name === 'REDIS_VERSION')?.value;

        const selectedFeatureCodes = ['cpu', 'disk-size', 'connection-limit', 'databases'];
        const features = selectedFeatureCodes
          .map((code) => addon.plan.features.find((f) => f.nameCode === code))
          .filter((feature) => feature != null)
          .map(
            (feature) =>
              /** @type {FormattedFeature} */ ({
                code: feature.nameCode,
                type: /** @type {FormattedFeature['type']} */ (feature.type.toLowerCase()),
                value: feature.computableValue ?? '',
                name: feature.name,
              }),
          );

        /** @type {Array<FormattedFeature>} */
        const specifications = [
          {
            code: 'plan',
            type: 'string',
            value: addon.plan.name,
          },
          ...features,
        ];

        updateComponent('state', {
          type: 'loaded',
          // The version section is not displayed if the variable is missing from the add-on environment
          version: version != null ? { stateType: 'up-to-date', installed: version, latest: version } : null,
          creationDate: addon.createdAt,
          specifications,
        });
      })
      .catch((error) =>
        unlessAborted(signal, error, () => {
          console.error(error);
          updateComponent('state', { type: 'error' });
        }),
      );
  },
});
