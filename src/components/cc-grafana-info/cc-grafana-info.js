import { css, html, LitElement } from 'lit';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { generateDocsHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import { CcGrafanaResetEvent, CcGrafanaToggleEvent } from './cc-grafana-info.events.js';

const GRAFANA_LOGO_URL = 'https://assets.clever-cloud.com/logos/grafana.svg';
const GRAFANA_HOME_SCREEN = 'https://assets.clever-cloud.com/grafana/screens/home.png';
const GRAFANA_RUNTIME_SCREEN = 'https://assets.clever-cloud.com/grafana/screens/runtime.png';
const GRAFANA_ADDON_SCREEN = 'https://assets.clever-cloud.com/grafana/screens/addon.png';
const GRAFANA_DOCUMENTATION = generateDocsHref('/metrics');

/**
 * @typedef {import('./cc-grafana-info.types.js').GrafanaInfoState} GrafanaInfoState
 */

/**
 * A component to display information about grafana and allow some actions: enable, disable, reset.
 *
 * @cssdisplay block
 */
export class CcGrafanaInfo extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {GrafanaInfoState} Sets the grafana info state. */
    this.state = { type: 'loading' };
  }

  _getDashboards() {
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

  _onEnableSubmit() {
    this.dispatchEvent(new CcGrafanaToggleEvent({ isEnabled: true }));
  }

  _onResetSubmit() {
    this.dispatchEvent(new CcGrafanaResetEvent());
  }

  _onDisableSubmit() {
    this.dispatchEvent(new CcGrafanaToggleEvent({ isEnabled: false }));
  }

  render() {
    const isSwitchingGrafanaStatus =
      this.state.type === 'loaded' && (this.state.info.action === 'enabling' || this.state.info.action === 'disabling');
    const isFormDisabled =
      this.state.type === 'error' || (this.state.type === 'loaded' && this.state.info.action != null);
    const isGrafanaDisabled = this.state.type === 'loaded' && this.state.info.status === 'disabled';
    const isGrafanaEnabled = this.state.type === 'loaded' && this.state.info.status === 'enabled';
    const isResetting =
      this.state.type === 'loaded' && this.state.info.status === 'enabled' && this.state.info.action === 'resetting';

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-grafana-info.main-title')}</div>

        ${isSwitchingGrafanaStatus ? html` <cc-loader slot="overlay"></cc-loader> ` : ''}

        <cc-block-section slot="content-body">
          <div slot="title">${i18n('cc-grafana-info.documentation-title')}</div>
          <div slot="info">${i18n('cc-grafana-info.documentation-description')}</div>
          <div>
            <cc-link href="${GRAFANA_DOCUMENTATION}" .icon=${iconInfo}>
              <span>${i18n('cc-grafana-info.link.doc')}</span>
            </cc-link>
          </div>
        </cc-block-section>

        ${this.state.type === 'loading'
          ? html`
              <cc-block-section slot="content-body">
                <div slot="title">${i18n('cc-grafana-info.loading-title')}</div>
                <div>
                  <cc-loader></cc-loader>
                </div>
              </cc-block-section>
            `
          : ''}
        ${this.state.type === 'error'
          ? html`
              <cc-block-section slot="content-body">
                <div slot="title">${i18n('cc-grafana-info.loading-title')}</div>
                <cc-notice intent="warning" message="${i18n('cc-grafana-info.error-loading')}"></cc-notice>
              </cc-block-section>
            `
          : ''}
        ${isGrafanaDisabled
          ? html`
              <cc-block-section slot="content-body">
                <div slot="title">${i18n('cc-grafana-info.enable-title')}</div>
                <div slot="info">
                  <p>${i18n('cc-grafana-info.enable-description')}</p>
                </div>
                <div>
                  <cc-button
                    success
                    ?waiting=${isSwitchingGrafanaStatus}
                    ?disabled=${isFormDisabled && !isSwitchingGrafanaStatus}
                    @cc-click=${this._onEnableSubmit}
                  >
                    ${i18n('cc-grafana-info.enable-title')}
                  </cc-button>
                </div>
              </cc-block-section>
            `
          : ''}
        ${this.state.type === 'loaded' && this.state.info.status === 'enabled'
          ? html`
              <cc-block-section slot="content-body">
                <div slot="title">${i18n('cc-grafana-info.grafana-link-title')}</div>
                <div slot="info">
                  <p>${i18n('cc-grafana-info.grafana-link-description')}</p>
                </div>
                ${this.state.info.link == null
                  ? html`
                      <cc-notice intent="warning" message="${i18n('cc-grafana-info.error-link-grafana')}"></cc-notice>
                    `
                  : html`
                      <div>
                        <cc-link href="${this.state.info.link}" image="${GRAFANA_LOGO_URL}">
                          <span>${i18n('cc-grafana-info.link.grafana')}</span>
                        </cc-link>
                      </div>
                    `}
              </cc-block-section>

              <cc-block-section slot="content-body">
                <div slot="title">${i18n('cc-grafana-info.reset-title')}</div>
                <div slot="info">${i18n('cc-grafana-info.reset-description')}</div>
                <div>
                  <cc-button
                    primary
                    ?disabled=${isFormDisabled && !isResetting}
                    ?waiting=${isResetting}
                    @cc-click=${this._onResetSubmit}
                  >
                    ${i18n('cc-grafana-info.reset-title')}
                  </cc-button>
                </div>
              </cc-block-section>
            `
          : ''}
        ${!isSwitchingGrafanaStatus
          ? html`
              ${this._getDashboards().map(
                (item) => html`
                  <cc-block-section slot="content-body">
                    <div slot="title">${item.title}</div>
                    <div slot="info">${item.description}</div>
                    <div>
                      <cc-link href="${item.url}" disable-external-link-icon a11y-desc="${item.alt}">
                        <img class="dashboard-screenshot" src="${item.url}" alt="${item.alt}" />
                      </cc-link>
                    </div>
                  </cc-block-section>
                `,
              )}
            `
          : ''}
        ${isGrafanaEnabled
          ? html`
              <cc-block-section slot="content-body">
                <div slot="title">${i18n('cc-grafana-info.disable-title')}</div>
                <div slot="info">${i18n('cc-grafana-info.disable-description')}</div>
                <div>
                  <cc-button
                    ?waiting=${isSwitchingGrafanaStatus}
                    danger
                    delay="3"
                    ?disabled=${isFormDisabled && !isSwitchingGrafanaStatus}
                    @cc-click=${this._onDisableSubmit}
                  >
                    ${i18n('cc-grafana-info.disable-title')}
                  </cc-button>
                </div>
              </cc-block-section>
            `
          : ''}

        <div slot="footer-right">
          <cc-link href="${GRAFANA_DOCUMENTATION}" .icon="${iconInfo}">
            ${i18n('cc-grafana-info.documentation.text')}
          </cc-link>
        </div>
      </cc-block>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        cc-img {
          border-radius: var(--cc-border-radius-default, 0.25em);
          flex: 0 0 auto;
          height: 1.5em;
          margin-right: 0.5em;
          width: 1.5em;
        }

        cc-icon {
          flex: 0 0 auto;
          margin-right: 0.5em;
        }

        cc-link {
          align-items: center;
          display: inline-flex;
        }

        .dashboard-screenshot {
          border-radius: var(--cc-border-radius-default, 0.25em);
          max-width: 50em;
          width: 100%;
        }

        p {
          margin: 0;
        }

        br {
          display: block;
          margin: 0.5em 0;
        }
      `,
    ];
  }
}

window.customElements.define('cc-grafana-info', CcGrafanaInfo);
