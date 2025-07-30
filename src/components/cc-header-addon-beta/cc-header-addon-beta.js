import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import { fakeString } from '../../lib/fake-strings.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-img/cc-img.js';
import '../cc-link/cc-link.js';
import '../cc-notice/cc-notice.js';
import '../cc-zone/cc-zone.js';
import { CcAddonRebuildEvent, CcAddonRestartEvent } from './cc-header-addon-beta.events.js';

const BREAKPOINTS = [450, 520, 750];

/** @type {Partial<CcHeaderAddonBetaStateLoaded>} */
const SKELETON_ADDON_INFO = {
  providerName: fakeString(15),
  providerLogoUrl: null,
  name: fakeString(15),
  id: fakeString(15),
  zone: null,
};

/**
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaState} CcHeaderAddonBetaState
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateLoaded} CcHeaderAddonBetaStateLoaded
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateLoading} CcHeaderAddonBetaStateLoading
 */

/**
 * A component to display various info about an add-on (name, plan, version...).
 *
 * @cssdisplay block
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
      type: 'loading',
      logsUrl: '',
      openLinks: [],
      actions: {
        restart: false,
        rebuildAndRestart: false,
      },
    };

    new ResizeController(this, {
      widthBreakpoints: BREAKPOINTS,
    });
  }

  _onRestart() {
    this.dispatchEvent(new CcAddonRestartEvent());
  }

  _onRebuild() {
    this.dispatchEvent(new CcAddonRebuildEvent());
  }

  render() {
    if (this.state.type === 'error') {
      return html` <cc-notice
        slot="content"
        intent="warning"
        message=${i18n('cc-header-addon-beta.error')}
      ></cc-notice>`;
    }

    const skeleton = this.state.type === 'loading';
    const addonInfo =
      this.state.type === 'loaded' || this.state.type === 'restarting' || this.state.type === 'rebuilding'
        ? this.state
        : { ...SKELETON_ADDON_INFO, ...this.state };
    const zoneState =
      (this.state.type === 'loaded' || this.state.type === 'restarting' || this.state.type === 'rebuilding') &&
      this.state.zone
        ? { type: 'loaded', ...this.state.zone }
        : { type: 'loading' };
    const isRestarting = this.state.type === 'restarting';
    const isRebuilding = this.state.type === 'rebuilding';

    return html`
      <cc-block>
        <div slot="content" class="main">
          <div class="addon-information">
            <cc-img
              class="logo"
              ?skeleton=${skeleton}
              src=${ifDefined(addonInfo.providerLogoUrl)}
              a11y-name=${addonInfo.providerName}
            ></cc-img>

            <div class="details">
              <div class="details__title">
                <span class="details__name ${classMap({ skeleton })}">${addonInfo.name}</span>
                ${addonInfo.productStatus
                  ? html` <cc-badge ?skeleton=${skeleton}>${addonInfo.productStatus}</cc-badge> `
                  : ''}
              </div>
              <div class="details__id">
                <span class="${classMap({ skeleton })}">${addonInfo.id}</span>
                ${this.state.type === 'loaded' || this.state.type === 'restarting' || this.state.type === 'rebuilding'
                  ? html` <cc-clipboard value=${addonInfo.id}></cc-clipboard> `
                  : ''}
              </div>
            </div>
          </div>

          <div class="actions">
            ${addonInfo.openLinks?.map(
              (link) => html`
                <cc-link mode="button" href="${link.url}" ?skeleton=${skeleton}>
                  ${i18n('cc-header-addon-beta.action.open-addon', { linkName: link.name })}</cc-link
                >
              `,
            )}
            ${addonInfo.actions?.restart === true
              ? html`
                  <cc-button
                    type="button"
                    ?skeleton=${skeleton}
                    ?waiting=${isRestarting}
                    ?disabled=${isRebuilding}
                    @cc-click=${this._onRestart}
                    >${i18n('cc-header-addon-beta.action.restart')}</cc-button
                  >
                `
              : ''}
            ${addonInfo.actions?.rebuildAndRestart === true
              ? html`
                  <cc-button
                    type="button"
                    ?skeleton=${skeleton}
                    ?waiting=${isRebuilding}
                    ?disabled=${isRestarting}
                    @cc-click=${this._onRebuild}
                    >${i18n('cc-header-addon-beta.action.restart-rebuild')}
                  </cc-button>
                `
              : ''}
          </div>
        </div>

        <div slot="footer-left" class="footer">
          ${addonInfo.logsUrl
            ? html`
                <cc-link
                  href=${addonInfo.logsUrl}
                  a11y-desc="${i18n('cc-header-addon-beta.logs.link')}"
                  ?skeleton=${skeleton}
                  >${i18n('cc-header-addon-beta.logs.link')}</cc-link
                >
              `
            : ''}
          <span class="footer__spacer"></span>
          <cc-zone .state=${zoneState} mode="small-infra"></cc-zone>
        </div>
      </cc-block>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .main {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .addon-information {
          display: flex;
          flex: 1 1 0;
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
          flex-direction: column;
          justify-content: space-around;
        }

        .details__title {
          align-items: center;
          display: flex;
          gap: 0.75em;
        }

        .details__name {
          font-size: 1.1em;
          font-weight: bold;
        }

        .details__id {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        :host([w-lt-750]) .details__id span {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          /** Change px to em or relative value ? */
          /* width: 300px; */
        }

        :host([w-lt-520]) .details__id span {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          /** Change px to em or relative value ? */
          /* width: 300px; */
        }

        :host([w-lt-450]) .details__id span {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          /** Change px to em or relative value ? */
          /* width: 200px; */
        }

        .actions {
          align-items: center;
          /* align-self: center; */
          display: flex;
          flex-wrap: wrap;
          gap: 0.75em;
          margin-block: 0;
        }

        .actions cc-link,
        .actions cc-button {
          flex: 1 1 auto;
          /* min-width: 0; */
        }

        :host([w-lt-520]) .actions cc-link {
          width: 100%;
        }

        :host([w-lt-520]) .actions cc-button {
          flex: 1 0 min(100%, 12.5em);
        }

        :host([w-lt-520]) .actions {
          display: flex;
          flex: 1 1 max-content;
          gap: 1em;
        }

        :host([w-lt-450]) .actions cc-link,
        :host([w-lt-450]) .actions cc-button {
          flex: 1 0 min(100%, 12.5em);
        }

        .footer {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          font-size: 0.9em;
          gap: 0.57em;
        }

        .footer__spacer {
          flex: 1 1 0;
        }

        .skeleton {
          background-color: #bbb;
          border-color: #777;
          color: transparent;
        }
      `,
    ];
  }
}
window.customElements.define('cc-header-addon-beta', CcHeaderAddonBeta);
