import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
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
  selector: 'cc-addon-info[smart-mode="fs-bucket"]',
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
      creationDate: '2025-08-06 15:03:00',
      specifications: [
        {
          code: 'plan',
          type: 'string',
          value: 'Basic',
        },
        {
          code: 'storage',
          type: 'string',
          value: '100 MB Free + 1.50€/GB/month',
        },
        {
          code: 'mounts',
          type: 'string',
          value: 'Unlimited',
        },
      ],
    };

    updateComponent('state', { type: 'loading', ...LOADING_STATE });
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.fs-bucket'),
      href: getDocUrl('/addons/fs-bucket'),
    });

    ccApiClient
      .send(new GetAddonCommand({ ownerId, addonId }), { signal })
      .then((addon) => {
        const features = [
          { code: 'storage', feature: addon.plan.features.find((f) => f.nameCode === 'storage') },
          { code: 'mounts', feature: addon.plan.features.find((f) => f.name === 'Mounts') },
        ]
          .filter(({ feature }) => feature != null)
          .map(
            ({ code, feature }) =>
              /** @type {FormattedFeature} */ ({
                code,
                type: 'string',
                value: feature.value,
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
