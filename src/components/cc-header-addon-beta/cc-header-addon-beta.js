import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { fakeString } from '../../lib/fake-strings.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-img/cc-img.js';
import '../cc-link/cc-link.js';
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
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaState} CcHeaderAddonBetaState
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateLoaded} CcHeaderAddonBetaStateLoaded
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateLoading} CcHeaderAddonBetaStateLoading
 * @typedef {import('./cc-header-addon-beta.types.js').LastUserAction} LastUserAction
 */

export class CcHeaderAddonBeta extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      // Rename _lastUserAction ?
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
      <cc-block>
        <div slot="content" class="main">
          <cc-img class="logo" ?skeleton=${skeleton} src=${addonInfo.providerLogoUrl}></cc-img>

          <div class="details">
            <div class="name ${classMap({ skeleton })}">${addonInfo.providerName}</div>
            <div class="id ${classMap({ skeleton })}">${addonInfo.id}</div>
          </div>

          <div class="actions">
            ${addonInfo.openLinks?.map(
              (link) => html`
                <div>
                  <cc-link mode="button" href="${link.url}">Open ${link.name}</cc-link>
                </div>
              `,
            )}
            ${addonInfo.actions?.restart === true
              ? html`
                  <div>
                    <cc-button type="button" ?skeleton="${skeleton}" @cc-click=${() => this._onRestart('normal')}
                      >Restart</cc-button
                    >
                  </div>
                `
              : ''}
            ${addonInfo.actions?.rebuildAndRestart === true
              ? html`
                  <div>
                    <cc-button type="button" ?skeleton="${skeleton}" @cc-click=${() => this._onRestart('rebuild')}
                      >Re-build and restart
                    </cc-button>
                  </div>
                `
              : ''}
          </div>
        </div>
        <div slot="footer-left" class="footer">
          <a href=${addonInfo.logsUrl} class=${classMap({ skeleton })}>View logs</a>
          <span class="spacer"></span>
          <cc-zone .state=${zoneState} mode="small-infra" class=${classMap({ skeleton })}></cc-zone>
        </div>
      </cc-block>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      // language=CSS
      css`
        .main {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .logo {
          align-self: flex-start;
          border-radius: var(--cc-border-radius-default, 0.25em);
          height: 3.25em;
          overflow: hidden;
          width: 3.25em;
        }

        .details {
          display: flex;
          flex: 1 1 max-content;
          flex-direction: column;
          justify-content: space-between;
        }

        .name {
          font-size: 1.1em;
          font-weight: bold;
        }

        .id {
        }

        .actions {
          align-items: center;
          /* align-self: center; */
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          margin-block: 0;
        }

        .skeleton {
        }

        .footer {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          font-size: 0.9em;
          gap: 0.57em;
        }

        .spacer {
          flex: 1 1 0;
        }
      `,
    ];
  }
}
window.customElements.define('cc-header-addon-beta', CcHeaderAddonBeta);
