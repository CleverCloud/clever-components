import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import '../cc-loader/cc-loader.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-error/cc-error.js';
import { css, html, LitElement } from 'lit';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';

const GRAFANA_LOGO_URL = 'https://assets.clever-cloud.com/logos/grafana.svg';
const GRAFANA_HOME_SCREEN = 'https://assets.clever-cloud.com/grafana/screens/home.png';
const GRAFANA_RUNTIME_SCREEN = 'https://assets.clever-cloud.com/grafana/screens/runtime.png';
const GRAFANA_ADDON_SCREEN = 'https://assets.clever-cloud.com/grafana/screens/addon.png';
const GRAFANA_DOCUMENTATION = 'https://www.clever-cloud.com/doc/administrate/metrics/overview/';

/**
 * @typedef {import('./cc-grafana-info.types.js').GrafanaErrorType} GrafanaErrorType
 * @typedef {import('./cc-grafana-info.types.js').GrafanaStatusType} GrafanaStatusType
 * @typedef {import('./cc-grafana-info.types.js').GrafanaWaitingType} GrafanaWaitingType
 */

/**
 * A component to display information about grafana and allow some actions: enable, disable, reset.
 *
 * @cssdisplay block
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

    /** @type {GrafanaErrorType} Displays an error message. */
    this.error = false;

    /** @type {string|null} Sets the grafana link. */
    this.link = null;

    /** @type {GrafanaStatusType} Grafana account status, is the Grafana enabled or disabled? Null means no data are received. */
    this.status = null;

    /** @type {GrafanaWaitingType} Waiting for the result status (based on actions: reset, disable or enable). */
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
              <cc-icon size="lg" .icon=${iconInfo}></cc-icon>
              <span>${i18n('cc-grafana-info.link.doc')}</span>
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
            </div>
            <div>
              <cc-button success ?skeleton=${this._skeleton} ?disabled=${isFormDisabled} @cc-button:click=${this._onEnableSubmit}>
                ${i18n('cc-grafana-info.enable-title')}
              </cc-button>
            </div>
          </cc-block-section>
        ` : ''}

        ${isGrafanaEnabled ? html`
          <cc-block-section>
            <div slot="title">${i18n('cc-grafana-info.grafana-link-title')}</div>
            <div slot="info">
              <p>${i18n('cc-grafana-info.grafana-link-description')}</p>
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
            <div>
              <cc-button primary ?skeleton=${this._skeleton} ?disabled=${isFormDisabled} ?waiting=${this.waiting === 'resetting'} @cc-button:click=${this._onResetSubmit}>
                ${i18n('cc-grafana-info.reset-title')}
              </cc-button>
            </div>
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

        ${isGrafanaEnabled ? html`
          <cc-block-section>
            <div slot="title">${i18n('cc-grafana-info.disable-title')}</div>
            <div slot="info">${i18n('cc-grafana-info.disable-description')}</div>
            <div>
              <cc-button danger delay="3" ?skeleton=${this._skeleton} ?disabled=${isFormDisabled} @cc-button:click=${this._onDisableSubmit}>
                ${i18n('cc-grafana-info.disable-title')}
              </cc-button>
            </div>
          </cc-block-section>
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
          width: 1.5em;
          height: 1.5em;
          flex: 0 0 auto;
          margin-right: 0.5em;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        cc-icon {
          flex: 0 0 auto;
          margin-right: 0.5em;
        }

        .cc-link {
          display: inline-flex;
          align-items: center;
        }

        .dashboard-screenshot {
          width: 100%;
          max-width: 50em;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        p {
          margin: 0;
        }

        br {
          display: block;
          margin: 0.5em 0;
        }

        cc-error.warning {
          margin-top: 1em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-grafana-info', CcGrafanaInfo);
