import '../atoms/cc-loader.js';
import '../molecules/cc-block-section.js';
import '../molecules/cc-block.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { ccLink, linkStyles } from '../templates/cc-link.js';

const infoSvg = new URL('../assets/info.svg', import.meta.url).href;

const GRAFANA_LOGO_URL = 'https://static-assets.cellar.services.clever-cloud.com/logos/grafana.svg';
const GRAFANA_HOME_SCREEN = 'https://static-assets.cellar.services.clever-cloud.com/grafana/screens/home.png';
const GRAFANA_RUNTIME_SCREEN = 'https://static-assets.cellar.services.clever-cloud.com/grafana/screens/runtime.png';
const GRAFANA_ADDON_SCREEN = 'https://static-assets.cellar.services.clever-cloud.com/grafana/screens/addon.png';
const GRAFANA_DOCUMENTATION = 'https://www.clever-cloud.com/doc/administrate/metrics/overview/';

/**
 * A component to display information about grafana and allow some actions: enable, disable, reset.
 *
 * @cssdisplay block
 *
 * @prop {false|"resetting"|"loading"|"disabling"|"enabling"|"link-grafana"} error - Displays an error message.
 * @prop {null|String} link - Set the Grafana link.
 * @prop {null|"enabled"|"disabled"} status - Grafana account status, is the Grafana enabled or disabled? Null means no data are received.
 * @prop {false|"resetting"|"disabling"|"enabling"} waiting - Waiting for the result status (based on actions: reset, disable or enable).
 *
 * @event {CustomEvent} cc-grafana-info:enable - Fires when the enable button is clicked.
 * @event {CustomEvent} cc-grafana-info:disable - Fires when the disable button is clicked.
 * @event {CustomEvent} cc-grafana-info:reset - Fires when the reset button is clicked.
 */
export class CcGrafanaInfo extends LitElement {

  static get properties () {
    return {
      error: { type: String },
      link: { type: String },
      status: { type: String },
      waiting: { type: String },
    };
  }

  constructor () {
    super();
    this.error = false;
    this.link = null;
    this.status = null;
    this.waiting = false;
  }

  _getDashboards () {
    return [
      {
        title: i18n('cc-grafana-info.screenshot.organisation.title'),
        url: GRAFANA_HOME_SCREEN,
        description: i18n('cc-grafana-info.screenshot.organisation.description'),
        alt: i18n('cc-grafana-info.screenshot.organisation.alt'),
      },
      {
        title: i18n('cc-grafana-info.screenshot.runtime.title'),
        url: GRAFANA_RUNTIME_SCREEN,
        description: i18n('cc-grafana-info.screenshot.runtime.description'),
        alt: i18n('cc-grafana-info.screenshot.runtime.alt'),
      },
      {
        title: i18n('cc-grafana-info.screenshot.addon.title'),
        url: GRAFANA_ADDON_SCREEN,
        description: i18n('cc-grafana-info.screenshot.addon.description'),
        alt: i18n('cc-grafana-info.screenshot.addon.alt'),
      },
    ];
  }

  _onEnableSubmit () {
    dispatchCustomEvent(this, 'enable');
  }

  _onResetSubmit () {
    dispatchCustomEvent(this, 'reset');
  }

  _onDisableSubmit () {
    dispatchCustomEvent(this, 'disable');
  }

  render () {

    const isWaitingGrafana = this.waiting === 'enabling' || this.waiting === 'disabling';
    const isFormDisabled = this.error !== false || this.waiting !== false;
    const isGrafanaStatusLoading = this.error !== 'loading' && this.status == null;
    const isGrafanaDisabled = this.error !== 'loading' && this.status === 'disabled';
    const isGrafanaEnabled = this.error !== 'loading' && this.status === 'enabled';

    return html`
      <cc-block>

        <div slot="title">${i18n('cc-grafana-info.main-title')}</div>

        ${isWaitingGrafana ? html`
          <cc-loader slot="overlay"></cc-loader>
        ` : ''}

        <cc-block-section>
          <div slot="title">${i18n('cc-grafana-info.documentation-title')}</div>
          <div slot="info">${i18n('cc-grafana-info.documentation-description')}</div>
          <div>
            ${ccLink(GRAFANA_DOCUMENTATION, html`
              <cc-img src="${infoSvg}"></cc-img><span>${i18n('cc-grafana-info.link.doc')}</span>
            `)}
          </div>
        </cc-block-section>

        ${this.error === 'loading' ? html`
          <cc-block-section>
            <div slot="title">${i18n('cc-grafana-info.loading-title')}</div>
            <div slot="info"></div>
            <div>
              <cc-error>${i18n('cc-grafana-info.error-loading')}</cc-error>
            </div>
          </cc-block-section>
        ` : ''}
          
        ${isGrafanaStatusLoading ? html`
          <cc-block-section>
            <div slot="title">${i18n('cc-grafana-info.loading-title')}</div>
            <div>
              <cc-loader></cc-loader>
            </div>
          </cc-block-section>
        ` : ''}

        ${isGrafanaDisabled ? html`
          <cc-block-section>
            <div slot="title">${i18n('cc-grafana-info.enable-title')}</div>
            <div slot="info">
              <p>${i18n('cc-grafana-info.enable-description')}</p>
              <cc-error class="warning">${i18n('cc-grafana-info.enable-description.warning')}</cc-error>
            </div>
            ${this.error === 'enabling' ? html`
              <cc-error>${i18n('cc-grafana-info.error-enabling')}</cc-error>
            ` : html`
              <div>
                <cc-button success ?skeleton=${this._skeleton} ?disabled=${isFormDisabled} @cc-button:click=${this._onEnableSubmit}>
                  ${i18n('cc-grafana-info.enable-title')}
                </cc-button>
              </div>
            `}
          </cc-block-section>
        ` : ''}

        ${isGrafanaEnabled ? html`
          <cc-block-section>
            <div slot="title">${i18n('cc-grafana-info.grafana-link-title')}</div>
            <div slot="info">
              <p>${i18n('cc-grafana-info.grafana-link-description')}</p>
              <cc-error class="warning">${i18n('cc-grafana-info.grafana-link-description.warning')}</cc-error>
            </div>
            ${this.error === 'link-grafana' || this.link == null ? html`
              <cc-error>${i18n('cc-grafana-info.error-link-grafana')}</cc-error>
            ` : html`
              <div>
                ${ccLink(this.link, html`
                  <cc-img src="${GRAFANA_LOGO_URL}"></cc-img><span>${i18n('cc-grafana-info.link.grafana')}</span>
                `)}
              </div>
            `}
          </cc-block-section>

          <cc-block-section>
            <div slot="title">${i18n('cc-grafana-info.reset-title')}</div>
            <div slot="info">${i18n('cc-grafana-info.reset-description')}</div>
            ${this.error === 'resetting' ? html`
              <cc-error>${i18n('cc-grafana-info.error-resetting')}</cc-error>
            ` : html`
              <div>
                <cc-button primary ?skeleton=${this._skeleton} ?disabled=${isFormDisabled} ?waiting=${this.waiting === 'resetting'} @cc-button:click=${this._onResetSubmit}>
                  ${i18n('cc-grafana-info.reset-title')}
                </cc-button>
              </div>
            `}
          </cc-block-section>

          <cc-block-section>
            <div slot="title">${i18n('cc-grafana-info.disable-title')}</div>
            <div slot="info">${i18n('cc-grafana-info.disable-description')}</div>
            ${this.error === 'disabling' ? html`
              <cc-error>${i18n('cc-grafana-info.error-disabling')}</cc-error>
            ` : html`
              <div>
                <cc-button danger delay="3" ?skeleton=${this._skeleton} ?disabled=${isFormDisabled} @cc-button:click=${this._onDisableSubmit}>
                  ${i18n('cc-grafana-info.disable-title')}
                </cc-button>
              </div>
            `}
          </cc-block-section>
        ` : ''}

        ${!isWaitingGrafana ? html`
          ${this._getDashboards().map((item) => html`
            <cc-block-section>
              <div slot="title">${item.title}</div>
              <div slot="info">${item.description}</div>
              <div>
                ${ccLink(item.url, html`
                  <img class="dashboard-screenshot" src="${item.url}" alt="${item.alt}">
                `)}
              </div>
            </cc-block-section>
          `)}
        ` : ''}

      </cc-block>
    `;
  }

  static get styles () {
    return [
      linkStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        cc-img {
          border-radius: 0.25em;
          flex: 0 0 auto;
          height: 1.5em;
          margin-right: 0.5em;
          width: 1.5em;
        }

        .cc-link {
          align-items: center;
          display: inline-flex;
        }

        .dashboard-screenshot {
          border-radius: 0.25em;
          max-width: 50em;
          width: 100%;
        }
        
        p {
          margin: 0;
        }
        
        cc-error.warning {
          margin-top: 1em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-grafana-info', CcGrafanaInfo);
