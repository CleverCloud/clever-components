import '../addon/cc-addon-option-form.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';

const KIBANA_LOGO_URL = 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-kibana.svg';
const APM_LOGO_URL = 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-apm.svg';

/**
 * A component that displays the available options of an elasticsearch add-on.
 *
 * * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/addon/cc-addon-elasticsearch-options.js)
 *
 * ## Type definitions
 *
 * ```js
 * interface Flavor {
 *   name: string,
 *   cpus: number,
 *   gpus: number,
 *   mem: number,
 *   microservice: boolean,
 *   monthlyCost: number,
 * }
 * ```
 *
 * ```js
 * interface Options {
 *   kibana: boolean,
 *   apm: boolean,
 * }
 * ```
 *
 * @prop {Flavor} apmFlavor - Sets the default `Flavor` used to run the APM app.
 * @prop {Flavor} apmEnabled - Enables APM.
 * @prop {Flavor} kibanaFlavor - Sets the default `Flavor` used to run the Kibana app.
 * @prop {Flavor} kibanaEnabled - Enables Kibana.
 * @prop {Array<String>} options - List of options to enable for this selection.
 *
 * @event {CustomEvent<Options>} cc-addon-elasticsearch-options:submit - Fires when the form is submitted.
 */
export class CcAddonElasticsearchOptions extends LitElement {

  static get properties () {
    return {
      options: { type: Array, attribute: 'options' },
      apmEnabled: { type: Boolean, attribute: 'apm-enabled' },
      apmFlavor: { type: Object, attribute: 'apm-flavor' },
      kibanaEnabled: { type: Boolean, attribute: 'kibana-enabled' },
      kibanaFlavor: { type: Object, attribute: 'kibana-flavor' },
    };
  }

  constructor () {
    super();
    this.options = [];
    this.apmEnabled = false;
    this.kibanaEnabled = false;
  }

  _onFormOptionsSubmit ({ detail }) {
    dispatchCustomEvent(this, 'submit', detail);
  }

  _getApmOption () {
    const description = html`
      <div class="option-details">${i18n('cc-addon-elasticsearch-options.description.apm')}</div>
      <cc-error class="option-warning">
        ${i18n('cc-addon-elasticsearch-options.warning.apm')}
        ${this.apmFlavor != null ? html`
          ${i18n('cc-addon-elasticsearch-options.warning.apm.details', this.apmFlavor)}
        ` : ''}
      </cc-error>`;

    return {
      title: 'APM',
      logo: APM_LOGO_URL,
      description,
      enabled: this.apmEnabled,
      name: 'apm',
    };
  }

  _getKibanaOption () {
    const description = html`
      <div class="option-details">${i18n('cc-addon-elasticsearch-options.description.kibana')}</div>
      <cc-error class="option-warning">
        ${i18n('cc-addon-elasticsearch-options.warning.kibana')}
        ${this.kibanaFlavor != null ? html`
          ${i18n('cc-addon-elasticsearch-options.warning.kibana.details', this.kibanaFlavor)}
        ` : ''}
      </cc-error>
    `;

    return {
      title: 'Kibana',
      logo: KIBANA_LOGO_URL,
      description,
      enabled: this.kibanaEnabled,
      name: 'kibana',
    };
  }

  _getFormOptions () {
    return this.options.map((option) => {
      switch (option) {
        case 'apm': return this._getApmOption();
        case 'kibana': return this._getKibanaOption();
        default: return null;
      };
    }).filter((option) => option !== null);
  }

  render () {
    const options = this._getFormOptions();
    const title = i18n('cc-addon-elasticsearch-options.title');

    return html`
      <cc-addon-option-form title="${title}" .options=${options} @cc-addon-option-form:submit="${this._onFormOptionsSubmit}">
        <div slot="description">${i18n('cc-addon-elasticsearch-options.description')}</div>
      </cc-addon-option-form>
    `;
  }

  static get styles () {
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
