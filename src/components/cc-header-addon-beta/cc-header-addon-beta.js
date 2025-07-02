import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { fakeString } from '../../lib/fake-strings.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-button/cc-button.js';
import '../cc-img/cc-img.js';
import '../cc-notice/cc-notice.js';
import '../cc-zone/cc-zone.js';
import { CcHeaderAddonBetaRestartEvent } from './cc-header-addon-beta.events.js';

/** @type {Partial<CcHeaderAddonBetaStateLoaded>} */
const SKELETON_ADDON_INFO = {
  providerName: fakeString(15),
  providerLogoUrl: fakeString(15),
  name: fakeString(15),
  id: fakeString(15),
  zone: null,
  logsUrl: fakeString(15),
  openLinks: [],
  actions: {
    restart: false,
    rebuildAndRestart: false,
  },
};

/**
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateLoaded} CcHeaderAddonBetaStateLoaded
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaState} CcHeaderAddonBetaState
 * @typedef {import('./cc-header-addon-beta.types.js').LastUserAction} LastUserAction
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateLoading} CcHeaderAddonBetaStateLoading
 *
 */

export class CcHeaderAddonBeta extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      _lastUserAction: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {CcHeaderAddonBetaState} */
    this.state = {
      type: 'loading',
      logsUrl: '',
      openLinks: [],
      actions: {
        restart: false,
        rebuildAndRestart: false,
      },
    };

    /** @type {LastUserAction|null} */
    this._lastUserAction = null;
  }

  /**
   * @param {'normal'|'rebuild'} type
   * @private
   */
  _onRestart(type) {
    this._lastUserAction = 'restart';
    this.dispatchEvent(new CcHeaderAddonBetaRestartEvent(type));
  }

  render() {
    if (this.state.type === 'error') {
      return html` <cc-notice slot="content" intent="warning" message="Something went wrong..."></cc-notice>`;
    }

    const skeleton = this.state.type === 'loading';
    const addonInfo = this.state.type === 'loaded' ? this.state : SKELETON_ADDON_INFO;
    const zoneState = this.state.type === 'loaded' ? { type: 'loaded', ...this.state.zone } : { type: 'loading' };

    return html`
      <div class="container">
        <cc-img class="logo" ?skeleton=${skeleton} src=${addonInfo.providerLogoUrl}></cc-img>
        <div class="name ${classMap({ skeleton })}">${addonInfo.providerName}</div>
        <div class="id ${classMap({ skeleton })}">${addonInfo.id}</div>
        <dl class="buttons">
          ${addonInfo.openLinks?.map((link) => html` <dd><a href="${link.url}">Open ${link.name}</a></dd> `)}
          ${addonInfo.actions?.restart === true
            ? html`
                <dd>
                  <cc-button type="button" ?skeleton="${skeleton}" @cc-click=${() => this._onRestart('normal')}
                    >Restart</cc-button
                  >
                </dd>
              `
            : ''}
          ${addonInfo.actions?.rebuildAndRestart === true
            ? html`
                <dd>
                  <cc-button type="button" ?skeleton="${skeleton}" @cc-click=${() => this._onRestart('rebuild')}
                    >Re-build and restart
                  </cc-button>
                </dd>
              `
            : ''}
        </dl>
      </div>
      <div class="footer">
        <a href=${addonInfo.logsUrl} class=${classMap({ skeleton })}>View logs</a>
        <cc-zone .state=${zoneState} mode="small-infra" class=${classMap({ skeleton })}></cc-zone>
      </div>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      // language=CSS
      css`
        .container {
          display: grid;
          grid-auto-columns: auto 1fr auto;
          grid-template-areas: 'logo name buttons' 'logo id buttons';
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

        .buttons {
          display: flex;
          grid-area: buttons;
        }

        .skeleton {
          background-color: #bbb;
          border-color: #777;
          color: transparent;
        }

        .footer {
          display: flex;
        }
      `,
    ];
  }
}
window.customElements.define('cc-header-addon-beta', CcHeaderAddonBeta);
