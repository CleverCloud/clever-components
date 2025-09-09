import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  iconCleverRunning as iconActive,
  iconCleverRestarting as iconDeploying,
  iconCleverRestartFailed as iconDeploymentFailed,
} from '../../assets/cc-clever.icons.js';
import { fakeString } from '../../lib/fake-strings.js';
import { isStringEmpty } from '../../lib/utils.js';
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
import { CcAddonRebuildEvent, CcAddonRestartEvent } from './cc-addon-header.events.js';

/** @type {{ [Property in DeploymentStatus]: IconModel }} */
const STATUS_ICON = {
  deploying: iconDeploying,
  active: iconActive,
  failed: iconDeploymentFailed,
};

/** @type {Partial<CcAddonHeaderStateLoaded>} */
const SKELETON_ADDON_INFO = {
  providerName: fakeString(15),
  providerLogoUrl: null,
  name: fakeString(15),
  id: fakeString(15),
  zone: null,
};

/**
 * @typedef {import('./cc-addon-header.types.js').CcAddonHeaderState} CcAddonHeaderState
 * @typedef {import('./cc-addon-header.types.js').CcAddonHeaderStateLoaded} CcAddonHeaderStateLoaded
 * @typedef {import('./cc-addon-header.types.js').DeploymentStatus} DeploymentStatus
 * @typedef {import('../common.types.js').IconModel} IconModel
 */

/**
 * A component to display various info about an add-on (name, plan, version...).
 *
 * @cssdisplay block
 */
export class CcAddonHeader extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {CcAddonHeaderState} Sets the state of the component. */
    this.state = {
      type: 'loading',
      logsUrl: '',
      openLinks: [],
      actions: {
        restart: false,
        rebuildAndRestart: false,
      },
    };
  }

  /**
   * @param {DeploymentStatus} deploymentStatus
   * @returns {string}
   * @private
   */
  _getStatusMsg(deploymentStatus) {
    if (deploymentStatus === 'deploying') {
      return i18n('cc-addon-header.state-msg.deployment-is-deploying');
    }
    if (deploymentStatus === 'active') {
      return i18n('cc-addon-header.state-msg.deployment-is-active');
    }
    if (deploymentStatus === 'failed') {
      return i18n('cc-addon-header.state-msg.deployment-failed');
    }
    return i18n('cc-addon-header.state-msg.unknown-state');
  }

  _onRestart() {
    this.dispatchEvent(new CcAddonRestartEvent());
  }

  _onRebuild() {
    this.dispatchEvent(new CcAddonRebuildEvent());
  }

  render() {
    if (this.state.type === 'error') {
      return html` <cc-notice slot="content" intent="warning" message=${i18n('cc-addon-header.error')}></cc-notice>`;
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
    const deploymentStatus = this.state.deploymentStatus;

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
                ${!isStringEmpty(addonInfo.productStatus)
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
                  ${i18n('cc-addon-header.action.open-addon', { linkName: link.name })}
                </cc-link>
              `,
            )}
            ${!isStringEmpty(addonInfo.configLink)
              ? html`
                  <cc-link mode="button" href="${addonInfo.configLink}" ?skeleton=${skeleton} download
                    >${i18n('cc-addon-header.action.get-config')}
                  </cc-link>
                `
              : ''}
            ${addonInfo.actions?.restart === true
              ? html`
                  <cc-button
                    type="button"
                    ?skeleton=${skeleton}
                    ?waiting=${isRestarting}
                    ?disabled=${isRebuilding}
                    @cc-click=${this._onRestart}
                  >
                    ${i18n('cc-addon-header.action.restart')}
                  </cc-button>
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
                  >
                    ${i18n('cc-addon-header.action.restart-rebuild')}
                  </cc-button>
                `
              : ''}
          </div>
        </div>

        <div slot="footer-left" class="footer messages">
          ${!isStringEmpty(deploymentStatus)
            ? html`
                <cc-icon
                  class="status-icon ${deploymentStatus}"
                  size="lg"
                  .icon=${STATUS_ICON[deploymentStatus]}
                  ?skeleton=${skeleton}
                ></cc-icon>
                <span class=${classMap({ skeleton })}> ${this._getStatusMsg(deploymentStatus)} </span>
              `
            : ''}
          ${!isStringEmpty(addonInfo.logsUrl)
            ? html`
                <cc-link
                  href=${addonInfo.logsUrl}
                  a11y-desc="${i18n('cc-addon-header.logs.link')}"
                  ?skeleton=${skeleton}
                >
                  ${i18n('cc-addon-header.logs.link')}
                </cc-link>
              `
            : ''}
        </div>
        <cc-zone slot="footer-right" .state=${zoneState} mode="small-infra"></cc-zone>
      </cc-block>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          container-type: inline-size;
          display: block;
        }

        .main {
          display: grid;
          flex-wrap: wrap;
          gap: 1em;
          grid-auto-flow: column;
          justify-content: space-between;
          min-width: 0;
        }

        @container (max-width: 59em) {
          .main {
            grid-auto-flow: row;
          }
        }

        .addon-information {
          display: flex;
          flex: 1 1 0;
          gap: 1em;
          min-width: 0;
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
          flex: 1;
          flex-direction: column;
          justify-content: space-around;
          min-width: 0;
        }

        .details__title {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em 0.75em;
        }

        .details__name {
          font-size: 1.1em;
          font-weight: bold;
        }

        .details__id {
          align-items: center;
          display: flex;
          gap: 0.5em;
          min-width: 0;
        }

        .details__id span {
          display: block;
          font-family: var(--cc-ff-monospace);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .actions {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75em;
        }

        .actions cc-link,
        .actions cc-button {
          flex: 1 1 auto;
        }

        @container (max-width: 59em) {
          .actions cc-link,
          .actions cc-button {
            flex: 0 0 auto;
          }
        }

        @container (max-width: 34em) {
          .actions {
            display: flex;
            flex: 1 1 auto;
          }

          .actions cc-link {
            width: 100%;
          }

          .actions cc-button {
            flex: 1 0 min(100%, 12.5em);
          }
        }

        @container (max-width: 28em) {
          .actions cc-link,
          .actions cc-button {
            flex: 1 0 min(100%, 12.5em);
          }
        }

        .footer {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          font-size: 0.9em;
          gap: 0.57em;
        }

        .messages {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          font-size: 0.9em;
          font-style: italic;
          gap: 0.57em;
        }

        .messages cc-link,
        .messages cc-zone {
          font-style: normal;
        }

        .status-icon.active {
          --cc-icon-color: var(--color-legacy-green);
          --cc-icon-size: 1.25em;
        }

        .status-icon.deploying {
          --cc-icon-size: 1.25em;
        }

        .status-icon.failed {
          --cc-icon-color: var(--color-legacy-red);
          --cc-icon-size: 1.25em;
        }

        .status-icon.unknown {
          --cc-icon-color: #ddd;
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
window.customElements.define('cc-addon-header', CcAddonHeader);
