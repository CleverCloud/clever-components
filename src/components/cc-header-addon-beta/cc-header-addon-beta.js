import { LitElement, css, html } from 'lit';
import '../cc-img/cc-img.js';
import '../cc-notice/cc-notice.js';

/**
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateLoaded} CcHeaderAddonBetaStateLoaded
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaState} CcHeaderAddonBetaState
 */

export class CcHeaderAddonBeta extends LitElement {
  static get properties() {
    return {
      addonHref: { type: String, attribute: 'addon-href' },
      // logo: { type: String },
      logsHref: { type: String, attribute: 'logs-href' },
      // region: { type: String },
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {string|null} Link "OPEN [ADDON_NAME]". */
    this.addonHref = null;

    /** @type {string|null} Link "View logs". */
    this.logsHref = null;

    /** @type {CcHeaderAddonBetaState} */
    this.state = {
      type: 'loaded',
      id: null,
      realId: null,
      name: null,
      provider: null,
      plan: null,
      creationDate: null,
      region: null,
    };
  }

  /**
   * @param {string} providerName
   */
  _getRender(providerName) {
    switch (providerName) {
      case 'Matomo Analytics':
        return this._renderMatomo();
      case 'Keycloak':
        return this._renderKeycloak();
      case 'Jenkins':
        return this._renderJenkins();
      default:
        return '';
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice slot="content" intent="warning" message="Something went wrong..."></cc-notice>`;
    }

    /** @type {string} */
    const providerName = this.state.provider?.name;
    return html` <div class="wrapper">${this._getRender(providerName)}</div> `;
  }

  _renderMatomo() {
    /** @type {CcHeaderAddonBetaStateLoaded} **/
    const addonInfo = this.state.type === 'loaded' ? this.state : null;

    return html`
      <div class="container">
        <cc-img class="logo" src=${addonInfo.provider.logoUrl}></cc-img>
        <div class="name">${addonInfo.name}</div>
        <div class="id">${addonInfo.realId}</div>
        <dl class="links">
          <dd><a href="${this.addonHref}">Open ${addonInfo.name}</a></dd>
          <dd><a href="http://example.com">Restart</a></dd>
          <dd><a href="http://example.com">Re-built and restart</a></dd>
        </dl>
      </div>
      <div class="footer">
        <a href=${this.logsHref}>View logs</a>
        <div class="region">${addonInfo.region}</div>
      </div>
    `;
  }

  _renderKeycloak() {
    /** @type {CcHeaderAddonBetaStateLoaded} **/
    const addonInfo = this.state.type === 'loaded' ? this.state : null;

    return html`
      <div class="container">
        <cc-img class="logo" src=${addonInfo.provider.logoUrl}></cc-img>
        <div class="name">${addonInfo.name}</div>
        <div class="id">${addonInfo.realId}</div>
        <dl class="links">
          <dd><a href="${this.addonHref}">Open ${addonInfo.name}</a></dd>
          <dd><a href="http://example.com">Restart</a></dd>
          <dd><a href="http://example.com">Re-built and restart</a></dd>
        </dl>
      </div>
      <div class="footer">
        <a href=${this.logsHref}>View logs</a>
        <div class="region">${addonInfo.region}</div>
      </div>
    `;
  }

  _renderJenkins() {
    /** @type {CcHeaderAddonBetaStateLoaded} **/
    const addonInfo = this.state.type === 'loaded' ? this.state : null;

    return html`
      <div class="container">
        <cc-img class="logo" src=${addonInfo.provider.logoUrl}></cc-img>
        <div class="name">${addonInfo.name}</div>
        <div class="id">${addonInfo.realId}</div>
        <dl class="links">
          <dd><a href="${this.addonHref}">Open ${addonInfo.name}</a></dd>
        </dl>
      </div>
      <div class="footer">
        <a href=${this.logsHref}>View logs</a>
        <div class="region">${addonInfo.region}</div>
      </div>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        .container {
          display: grid;
          grid-auto-columns: auto 1fr auto;
          grid-template-areas: 'logo name links' 'logo id links';
        }

        .logo {
          grid-area: logo;
          height: 5em;
          width: 5em;
        }

        .name {
          grid-area: name;
        }

        .id {
          grid-area: id;
        }

        .links {
          display: flex;
          grid-area: links;
        }
      `,
    ];
  }
}
window.customElements.define('cc-header-addon-beta', CcHeaderAddonBeta);
