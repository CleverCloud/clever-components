import '../atoms/cc-button.js';
import '../atoms/cc-img.js';
import '../atoms/cc-toggle.js';
import '../molecules/cc-block.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { linkStyles } from '../templates/cc-link.js';

const KIBANA_LOGO_URL = 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-kibana.svg';
const APM_LOGO_URL = 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-apm.svg';

/**
 * A form component to select the two options of our Elasticsearch offer: Kibana and APM.
 *
 * ## Details
 *
 * * If `apmFlavor` or `kibanaFlavor` is null, the warning message will not display the flavor details and exact cost.
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
 *
 * @event {CustomEvent<Options>} cc-elasticsearch-options:submit - Fires whenever the confirm button is clicked.
 */
export class CcElasticsearchOptions extends LitElement {

  static get properties () {
    return {
      apmEnabled: { type: Boolean, attribute: 'apm-enabled' },
      apmFlavor: { type: Object, attribute: 'apm-flavor' },
      kibanaEnabled: { type: Boolean, attribute: 'kibana-enabled' },
      kibanaFlavor: { type: Object, attribute: 'kibana-flavor' },
    };
  }

  constructor () {
    super();
    this.apmEnabled = false;
    this.kibanaEnabled = false;
  }

  _onToggleKibana () {
    this.kibanaEnabled = !this.kibanaEnabled;
  }

  _onToggleApm () {
    this.apmEnabled = !this.apmEnabled;
  }

  _onSubmit () {
    dispatchCustomEvent(this, 'submit', { kibana: this.kibanaEnabled, apm: this.apmEnabled });
  }

  render () {

    const choices = [{
      label: i18n('cc-elasticsearch-options.disabled'), value: false,
    }, { label: i18n('cc-elasticsearch-options.enabled'), value: true }];

    return html`
      
      <cc-block>
        <div slot="title">${i18n('cc-elasticsearch-options.title')}</div>
        <div class="description">${i18n('cc-elasticsearch-options.description')}</div>
        <div class="option ${classMap({ 'option--enabled': this.kibanaEnabled })}">
          <cc-img class="logo" src=${KIBANA_LOGO_URL}></cc-img>
          <div class="option-main">
            <div class="option-name">Kibana</div>
            <div class="option-details">${i18n('cc-elasticsearch-options.description.kibana')}</div>
            <cc-error class="option-warning">
              ${i18n('cc-elasticsearch-options.warning.kibana')}
              ${this.kibanaFlavor != null ? html`
                ${i18n('cc-elasticsearch-options.warning.kibana.details', this.kibanaFlavor)}
              ` : ''}
            </cc-error>
            <cc-toggle .choices=${choices} .value=${this.kibanaEnabled} @cc-toggle:input=${this._onToggleKibana}></cc-toggle>
          </div>
        </div>
        <div class="option ${classMap({ 'option--enabled': this.apmEnabled })}">
          <cc-img class="logo" src=${APM_LOGO_URL}></cc-img>
          <div class="option-main">
            <div class="option-name">APM</div>
            <div class="option-details">${i18n('cc-elasticsearch-options.description.apm')}</div>
            <cc-error class="option-warning">
              ${i18n('cc-elasticsearch-options.warning.apm')}
              ${this.apmFlavor != null ? html`
                ${i18n('cc-elasticsearch-options.warning.apm.details', this.apmFlavor)}
              ` : ''}
            </cc-error>
            <cc-toggle .choices=${choices} .value=${this.apmEnabled} @cc-toggle:input=${this._onToggleApm}></cc-toggle>
          </div>
        </div>
        <div class="button-bar"><cc-button primary @cc-button:click=${this._onSubmit}>
          ${i18n('cc-elasticsearch-options.confirm')}
        </cc-button></div>
      </cc-block>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      linkStyles,
      css`
        :host {
          display: block;
        }

        .option {
          border-radius: 0.25rem;
          display: grid;
          grid-gap: 1rem;
          grid-template-columns: min-content 1fr;
          padding: 1rem;
        }

        .option:not(.option--enabled) {
          background-color: #f8f8f8;
          border: 2px solid #f8f8f8;
        }

        .option.option--enabled {
          border: 2px solid hsl(144, 56%, 43%);
        }

        .logo {
          border-radius: 0.25rem;
          height: 1.6rem;
          width: 1.6rem;
        }

        .option-main {
          display: grid;
          grid-gap: 0.5rem;
        }

        .option-name {
          font-weight: bold;
          line-height: 1.6rem;
          min-height: 1.6rem;
        }

        .description,
        .option-details {
          line-height: 1.5;
        }

        .option-warning {
          color: #555;
          font-style: italic;
        }

        cc-toggle {
          justify-self: end;
          margin: 0.5rem 0 0;
        }

        .option--enabled cc-toggle {
          --cc-toggle-color: hsl(144, 56%, 43%);
        }

        .button-bar {
          display: grid;
          justify-content: flex-end;
        }

        cc-button {
          margin: 0;
        }

        [title] {
          cursor: help;
        }
      `,
    ];
  }
}

window.customElements.define('cc-elasticsearch-options', CcElasticsearchOptions);
