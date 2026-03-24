import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { GetJenkinsInfoCommand } from '@clevercloud/client/cc-api-commands/jenkins/get-jenkins-info-command.js';
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
  selector: 'cc-addon-info[smart-mode="jenkins"]',
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
          value: 'XS',
        },
        {
          code: 'cpu',
          type: 'number',
          value: 2,
        },
        {
          code: 'memory',
          type: 'bytes',
          value: 4,
        },
        {
          code: 'disk-size',
          type: 'bytes',
          value: 40,
        },
      ],
      encryption: true,
    };

    updateComponent('state', { type: 'loading', ...LOADING_STATE });
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.jenkins'),
      href: getDocUrl('/addons/jenkins'),
    });

    Promise.all([
      ccApiClient.send(new GetAddonCommand({ ownerId, addonId }), { signal }),
      ccApiClient.send(new GetJenkinsInfoCommand({ addonId }), { signal }),
    ])
      .then(([addon, jenkinsInfo]) => {
        const plan = addon.plan.name;
        const selectedFeatureCodes = ['cpu', 'memory', 'disk-size'];
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
          /** @type {FormattedFeature} */
          ({
            code: 'plan',
            type: 'string',
            value: plan,
          }),
          ...features,
        ];
        const encryptionFeature = jenkinsInfo.features.find((f) => f.name === 'encryption');

        updateComponent('state', {
          type: 'loaded',
          version: {
            stateType: 'up-to-date',
            installed: jenkinsInfo.version,
            latest: jenkinsInfo.version,
          },
          creationDate: addon.creationDate,
          specifications,
          encryption: encryptionFeature.enabled,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});
