import { LitElement, css, html } from 'lit';
import '../cc-img/cc-img.js';

/**
 * @typedef {import('./cc-header-addon-beta.types.js').Addon} Addon
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateLoaded} CcHeaderAddonBetaStateLoaded
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaState} CcHeaderAddonBetaState
 */

export class CcHeaderAddonBeta extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {CcHeaderAddonBetaState} */
    this.state = {
      type: 'loaded',
      addonHref: '',
      logsHref: '',
      zone: '',
      id: '',
      logo: '',
      name: '',
    };
  }

  render() {
    /** @type {CcHeaderAddonBetaStateLoaded} **/
    const addonInfo = this.state.type === 'loaded' ? this.state : null;

    return html`
      <div class="container">
        <cc-img class="logo" src=${addonInfo.logo}></cc-img>
        <div class="name">${addonInfo.name}</div>
        <div class="id">${addonInfo.id}</div>
        <dl class="links">
          <dd><a href="${addonInfo.addonHref}">Open ${addonInfo.name}</a></dd>
          <dd>
            <slot name="restart"></slot>
          </dd>
          <dd>
            <slot name="rebuild"></slot>
          </dd>
        </dl>
      </div>
      <div class="footer">
        <a href=${addonInfo.logsHref}>View logs</a>
        <div class="zone">${addonInfo.zone}</div>
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
