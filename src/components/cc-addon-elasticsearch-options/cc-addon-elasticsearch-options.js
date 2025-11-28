import { css, html, LitElement } from 'lit';
import { iconRemixAlertFill as iconAlert } from '../../assets/cc-remix.icons.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { ccAddonEncryptionAtRestOption } from '../../templates/cc-addon-encryption-at-rest-option/cc-addon-encryption-at-rest-option.js';
import { i18n } from '../../translations/translation.js';
import '../cc-addon-option-form/cc-addon-option-form.js';

const KIBANA_LOGO_URL = getAssetUrl('/logos/elasticsearch-kibana.svg');
const APM_LOGO_URL = getAssetUrl('/logos/elasticsearch-apm.svg');

/**
 * @import { AddonOption, AddonOptionWithMetadata, FlavorWithMonthlyCost, Flavor, ElasticAddonOption } from '../common.types.js'
 */

/**
 * A component that displays the available options of an elasticsearch add-on.
 *
 * @cssdisplay block
 */
export class CcAddonElasticsearchOptions extends LitElement {
  static get properties() {
    return {
      options: { type: Array },
    };
  }

  constructor() {
    super();

    /** @type {Array<AddonOption>} List of options for this add-on. */
    this.options = [];
  }

  /**
   * Returns the metadata for an Elasticsearch option (APM or Kibana) including title, warning message, details, and logo URL
   *
   * @param {ElasticAddonOption<Flavor | FlavorWithMonthlyCost>['name']} elasticOptionName
   * @returns {{ title: string, warning: string, details: Node, logo: string }}
   */
  _getElasticsearchOptionData(elasticOptionName) {
    switch (elasticOptionName) {
      case 'apm':
        return {
          title: 'APM',
          warning: i18n('cc-addon-elasticsearch-options.warning.apm'),
          details: i18n('cc-addon-elasticsearch-options.details.apm'),
          logo: APM_LOGO_URL,
        };
      case 'kibana':
        return {
          title: 'Kibana',
          warning: i18n('cc-addon-elasticsearch-options.warning.kibana'),
          details: i18n('cc-addon-elasticsearch-options.details.kibana'),
          logo: KIBANA_LOGO_URL,
        };
    }
  }

  /**
   * @param {ElasticAddonOption<Flavor | FlavorWithMonthlyCost>} addonOption
   * @returns {AddonOptionWithMetadata}
   */
  _getElasticAddonOption(addonOption) {
    const { title, warning, details, logo } = this._getElasticsearchOptionData(addonOption.name);

    const description = html`
      <div class="option-details">${details}</div>
      <div class="option-warning">
        <cc-icon
          .icon="${iconAlert}"
          a11y-name="${i18n('cc-addon-elasticsearch-options.error.icon-a11y-name')}"
          class="icon-warning"
        ></cc-icon>
        <div>
          <p>${warning}</p>
          <p>
            <span class="options-warning">
              ${i18n('cc-addon-elasticsearch-options.warning.flavor', addonOption.flavor)}
            </span>
            ${'monthlyCost' in addonOption.flavor && addonOption.flavor.monthlyCost != null
              ? html`
                  <span class="options-warning">
                    ${i18n('cc-addon-elasticsearch-options.warning.monthly-cost', addonOption.flavor.monthlyCost)}
                  </span>
                `
              : ''}
          </p>
        </div>
      </div>
    `;

    return {
      title,
      logo,
      description,
      enabled: addonOption.enabled,
      name: addonOption.name,
    };
  }

  _getFormOptions() {
    return this.options
      .map((option) => {
        switch (option.name) {
          case 'apm':
          case 'kibana':
            return this._getElasticAddonOption(option);
          case 'encryption':
            return ccAddonEncryptionAtRestOption(option);
          default:
            return null;
        }
      })
      .filter((option) => option != null);
  }

  render() {
    const options = this._getFormOptions();
    const heading = i18n('cc-addon-elasticsearch-options.title');
    const hasMonthlyCost = this.options.some((option) => 'flavor' in option && 'monthlyCost' in option.flavor);

    return html`
      <cc-addon-option-form heading="${heading}" .options=${options}>
        <div slot="description">
          ${i18n('cc-addon-elasticsearch-options.description')}
          ${hasMonthlyCost ? i18n('cc-addon-elasticsearch-options.additional-cost') : ''}
        </div>
      </cc-addon-option-form>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-elasticsearch-options', CcAddonElasticsearchOptions);
