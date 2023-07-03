import '../cc-button/cc-button.js';
import '../cc-notice/cc-notice.js';
import '../cc-icon/cc-icon.js';
import '../cc-zone/cc-zone.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  iconCleverGit as iconGit,
  iconCleverRestartFailed as iconRestartFailed,
  iconCleverRestarting as iconRestarting,
  iconCleverRunning as iconRunning,
  iconCleverStartFailed as iconStartFailed,
  iconCleverStarting as iconStarting,
  iconCleverUnknown as iconUnknown,
} from '../../assets/cc-clever.icons.js';
import {
  iconRemixStopFill as iconStopped,
} from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { waitingStyles } from '../../styles/waiting.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';

const commitIcon = {
  git: iconGit,
  running: iconRunning,
  starting: iconStarting,
};

const statusIcon = {
  'restart-failed': iconRestartFailed,
  restarting: iconRestarting,
  'restarting-with-downtime': iconStarting,
  running: iconRunning,
  'start-failed': iconStartFailed,
  starting: iconStarting,
  stopped: iconStopped,
};

const SKELETON_APP = {
  name: '??????????????????????????',
  commit: '????????????????????????????????????????',
};

const SKELETON_STATUS = 'unknown';

/**
 * @typedef {import('../common.types.js').App} App
 * @typedef {import('../common.types.js').AppStatus} AppStatus
 * @typedef {import('../common.types.js').Zone} Zone
 */

/**
 * A component to display various info about an app (name, commits, status...).
 *
 * ## Details
 *
 * * When `app` and `status` are null, a skeleton screen UI pattern is displayed (loading hint).
 * * When only `status` is null, a skeleton screen UI pattern is displayed on the buttons and status message.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent} cc-header-app:cancel - Fires whenever the cancel button is clicked.
 * @event {CustomEvent} cc-header-app:restart - Fires whenever one of the 3 restart buttons is clicked.
 * @event {CustomEvent} cc-header-app:start - Fires whenever one of the 3 start buttons is clicked.
 * @event {CustomEvent} cc-header-app:stop - Fires whenever the stop button is clicked (after the delay).
 */
export class CcHeaderApp extends LitElement {

  static get properties () {
    return {
      app: { type: Object },
      disableButtons: { type: Boolean, attribute: 'disable-buttons', reflect: true },
      error: { type: Boolean, reflect: true },
      runningCommit: { type: String, attribute: 'running-commit' },
      startingCommit: { type: String, attribute: 'starting-commit' },
      status: { type: String },
      zone: { type: Object },
      _lastUserAction: { type: String, state: true },
    };
  }

  constructor () {
    super();

    /** @type {App|null} Sets application details and config. */
    this.app = null;

    /** @type {boolean} Disables all buttons (in a "login as" use case). */
    this.disableButtons = false;

    /** @type {boolean}  Displays an error message. */
    this.error = false;

    /** @type {string|null} Sets the running commit (if app is running). */
    this.runningCommit = null;

    /** @type {string|null} Sets the starting commit (if app is deploying). */
    this.startingCommit = null;

    /** @type {AppStatus|null} Sets application status. */
    this.status = null;

    /** @type {Zone|null} Sets application zone. */
    this.zone = null;

    /** @type {string|null} */
    this._lastUserAction = null;
  }

  _getCommitTitle (type, commit) {
    if (commit == null) {
      return;
    }
    if (type === 'git') {
      return i18n('cc-header-app.commits.git', { commit });
    }
    if (type === 'running') {
      return i18n('cc-header-app.commits.running', { commit });
    }
    if (type === 'starting') {
      return i18n('cc-header-app.commits.starting', { commit });
    }
  };

  _getStatusMsg (status) {
    if (status === 'restart-failed') {
      return i18n('cc-header-app.state-msg.app-is-running') + ' ' + i18n('cc-header-app.state-msg.last-deploy-failed');
    }
    if (status === 'restarting') {
      return i18n('cc-header-app.state-msg.app-is-restarting');
    }
    if (status === 'restarting-with-downtime') {
      return i18n('cc-header-app.state-msg.app-is-restarting');
    }
    if (status === 'running') {
      return i18n('cc-header-app.state-msg.app-is-running');
    }
    if (status === 'start-failed') {
      return i18n('cc-header-app.state-msg.app-is-stopped') + ' ' + i18n('cc-header-app.state-msg.last-deploy-failed');
    }
    if (status === 'starting') {
      return i18n('cc-header-app.state-msg.app-is-starting');
    }
    if (status === 'stopped') {
      return i18n('cc-header-app.state-msg.app-is-stopped');
    }
    return i18n('cc-header-app.state-msg.unknown-state');
  };

  _getLastUserActionMsg () {
    if (this._lastUserAction === 'start') {
      return i18n('cc-header-app.user-action-msg.app-will-start');
    }
    if (this._lastUserAction === 'restart') {
      return i18n('cc-header-app.user-action-msg.deploy-will-begin');
    }
    if (this._lastUserAction === 'cancel') {
      return i18n('cc-header-app.user-action-msg.deploy-cancelled');
    }
    if (this._lastUserAction === 'stop') {
      return i18n('cc-header-app.user-action-msg.app-will-stop');
    }
  };

  _onStart (type) {
    this._lastUserAction = 'start';
    dispatchCustomEvent(this, 'start', type);
  }

  _onRestart (type) {
    this._lastUserAction = 'restart';
    dispatchCustomEvent(this, 'restart', type);
  }

  _onCancel () {
    this._lastUserAction = 'cancel';
    dispatchCustomEvent(this, 'cancel');
  }

  _onStop () {
    this._lastUserAction = 'stop';
    dispatchCustomEvent(this, 'stop');
  }

  willUpdate (changeProperties) {
    if (changeProperties.has('status')) {
      this._lastUserAction = (changeProperties.get('status') !== this.status)
        ? null
        : this._lastUserAction;
    }
  }

  render () {

    // Quick short circuit for errors
    if (this.error) {
      return html`<cc-notice intent="warning" message="${i18n('cc-header-app.error')}"></cc-notice>`;
    }

    const skeleton = (this.app == null);
    const { name, commit, variantName, variantLogo, lastDeploymentLogsUrl } = skeleton ? SKELETON_APP : this.app;
    const skeletonStatus = (this.status == null);
    const status = skeletonStatus ? SKELETON_STATUS : this.status;

    const isDeploying = ['restarting', 'restarting-with-downtime', 'starting'].includes(status);
    const isRunning = ['restart-failed', 'restarting', 'running'].includes(status);
    const shouldDisableAllButtons = (this._lastUserAction != null || this.disableButtons);
    const shouldDisableStopButton = ['start-failed', 'stopped', 'unknown'].includes(status);
    const canStart = ['start-failed', 'stopped'].includes(status);
    const canRestart = skeletonStatus || ['restart-failed', 'running', 'unknown'].includes(status);
    const shouldDisplayStatusMessage = (this._lastUserAction !== 'start' && this._lastUserAction !== 'stop');
    const shouldDisplayLogsLink = ['restart-failed', 'restarting', 'restarting-with-downtime', 'starting', 'start-failed'].includes(status);
    const disableButtonsTitle = this.disableButtons ? i18n('cc-header-app.disable-buttons') : undefined;

    return html`
      <div class="main">
        <div class="flavor-logo ${classMap({ skeleton })}" title=${ifDefined(variantName)}>
          <!-- image has a presentation role => alt="" -->
          <img class="flavor-logo_img" src=${ifDefined(variantLogo)} alt="">
        </div>

        <div class="details">
          <div class="name"><span class=${classMap({ skeleton })}>${name}</span></div>
          <div class="commits">
            ${this._renderCommit(commit, 'git', skeleton)}
            ${isRunning ? this._renderCommit(this.runningCommit, 'running', skeleton) : ''}
            ${isDeploying ? this._renderCommit(this.startingCommit, 'starting', skeleton) : ''}
          </div>
        </div>

        <div class="buttons">

          ${canStart ? html`
            <cc-button title=${ifDefined(disableButtonsTitle)} ?disabled=${shouldDisableAllButtons} @cc-button:click=${() => this._onStart('normal')}>
              ${i18n('cc-header-app.action.start')}
            </cc-button>
            <cc-button title=${ifDefined(disableButtonsTitle)} ?disabled=${shouldDisableAllButtons} @cc-button:click=${() => this._onStart('rebuild')}>
              ${i18n('cc-header-app.action.start-rebuild')}
            </cc-button>
            <cc-button title=${ifDefined(disableButtonsTitle)} ?disabled=${shouldDisableAllButtons} @cc-button:click=${() => this._onStart('last-commit')}>
              ${i18n('cc-header-app.action.start-last-commit')}
            </cc-button>
          ` : ''}

          ${canRestart ? html`
            <cc-button title=${ifDefined(disableButtonsTitle)} ?skeleton=${skeletonStatus} ?disabled=${shouldDisableAllButtons} @cc-button:click=${() => this._onRestart('normal')}>
              ${i18n('cc-header-app.action.restart')}
            </cc-button>
            <cc-button title=${ifDefined(disableButtonsTitle)} ?skeleton=${skeletonStatus} ?disabled=${shouldDisableAllButtons} @cc-button:click=${() => this._onRestart('rebuild')}>
              ${i18n('cc-header-app.action.restart-rebuild')}
            </cc-button>
            <cc-button title=${ifDefined(disableButtonsTitle)} ?skeleton=${skeletonStatus} ?disabled=${shouldDisableAllButtons} @cc-button:click=${() => this._onRestart('last-commit')}>
              ${i18n('cc-header-app.action.restart-last-commit')}
            </cc-button>
          ` : ''}

          ${isDeploying ? html`
            <cc-button warning outlined title=${ifDefined(disableButtonsTitle)} ?disabled=${shouldDisableAllButtons} @cc-button:click=${this._onCancel}>
              ${i18n('cc-header-app.action.cancel-deployment')}
            </cc-button>
          ` : ''}

          <cc-button danger outlined delay="3"
            title=${ifDefined(disableButtonsTitle)}
            ?skeleton=${skeletonStatus}
            ?disabled=${shouldDisableAllButtons || shouldDisableStopButton}
            @cc-button:click=${this._onStop}
          >${i18n('cc-header-app.action.stop')}</cc-button>

        </div>
      </div>

      <div class="messages ${classMap({ 'cc-waiting': isDeploying })}">
        ${(shouldDisplayStatusMessage) ? html`
          <cc-icon class="status-icon ${status}" size="lg" .icon=${statusIcon[status] || iconUnknown}></cc-icon>
          <span class=${classMap({ skeleton: skeletonStatus })}>
            ${this._getStatusMsg(status)}
          </span>
          ${shouldDisplayLogsLink ? ccLink(lastDeploymentLogsUrl, i18n('cc-header-app.read-logs')) : ''}
        ` : ''}
        ${this._lastUserAction != null ? html`
          ${this._getLastUserActionMsg()}
        ` : ''}
        ${this.zone != null ? html`
          <span class="spacer"></span>
          <cc-zone .zone=${this.zone} mode="small-infra"></cc-zone>
        ` : ''}
      </div>
    `;
  }

  _renderCommit (commit, type, skeleton) {
    if (commit == null && type !== 'git') {
      return '';
    }
    return html`
      <span
        class="commit ${classMap({ 'cc-waiting': (type === 'starting') })}"
        title=${ifDefined(skeleton ? undefined : this._getCommitTitle(type, commit))}
        data-type=${type}
      >
        <cc-icon class="commit_img ${type}" .icon=${commitIcon[type]}></cc-icon>
        ${commit != null ? html`
          <!-- Keep this on one line to ease copy/paste -->
          <span class=${classMap({ skeleton })}>${(commit.slice(0, 8))}<span class="commit_rest">${(commit.slice(8))}</span></span>
        ` : ''}
        ${commit == null ? html`
          <span>${i18n('cc-header-app.commits.no-commits')}</span>
        ` : ''}
      </span>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      linkStyles,
      waitingStyles,
      // language=CSS
      css`
        :host {
          display: block;
          overflow: hidden;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }
        
        :host([error]) {
          border: none;
        }

        .main {
          display: flex;
          flex-wrap: wrap;
          padding: 1em;
          gap: 1em;
        }

        .flavor-logo {
          overflow: hidden;
          width: 3.25em;
          height: 3.25em;
          align-self: flex-start;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .flavor-logo_img {
          display: block;
          width: 100%;
          height: 100%;
        }

        .skeleton .flavor-logo_img {
          opacity: 0;
        }

        .details {
          display: flex;
          flex: 1 1 max-content;
          flex-direction: column;
          justify-content: space-between;
        }

        .commits {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .name {
          font-size: 1.1em;
          font-weight: bold;
        }

        .commit {
          display: flex;
          align-items: center;
        }

        .commit_img {
          margin-right: 0.2em;
        }

        .commit_img.git {
          --cc-icon-color: #555;
          --cc-icon-size: 1.3em;
        }

        .commit_img.running {
          --cc-icon-color: var(--color-legacy-green);
          --cc-icon-size: 1.25em;
        }

        .commit_img.starting {
          --cc-icon-color: var(--color-legacy-blue-icon);
          --cc-icon-size: 1.25em;
        }

        /* We hide the right part of the commit this way so this can be part of a copy/paste */

        .commit_rest {
          font-size: 0;
        }

        .buttons {
          display: flex;
          flex-wrap: wrap;
          align-self: center;
          gap: 1em;
        }

        cc-button {
          min-width: 0;
          flex: 1 1 auto;
        }

        :host([disable-buttons]) cc-button {
          cursor: not-allowed;
        }

        .messages {
          display: flex;
          box-sizing: border-box;
          flex-wrap: wrap;
          align-items: center;
          padding: 0.5em 1.1em;
          background-color: var(--cc-color-bg-neutral);
          box-shadow: inset 0 6px 6px -6px rgb(0 0 0 / 40%);
          font-size: 0.9em;
          font-style: italic;
          gap: 0.57em;
        }

        .status-icon {
          font-size: unset;
          margin-block: 0;
          margin-inline-end: 0;
        }

        .status-icon.restarting-with-downtime {
          --cc-icon-color: var(--color-legacy-blue-icon);
          --cc-icon-size: 1.25em;
        }

        .status-icon.running {
          --cc-icon-color: var(--color-legacy-green);
          --cc-icon-size: 1.25em;
        }

        .status-icon.start-failed {
          --cc-icon-color: var(--color-legacy-red);
          --cc-icon-size: 1.25em;
        }

        .status-icon.starting {
          --cc-icon-color: var(--color-legacy-blue-icon);
          --cc-icon-size: 1.25em;
        }

        .status-icon.stopped {
          --cc-icon-color: #ddd;
        }

        .status-icon.unknown {
          --cc-icon-color: #ddd;
        }

        .spacer {
          flex: 1 1 0;
        }

        cc-zone {
          font-style: normal;
          white-space: nowrap;
        }

        [title] {
          cursor: help;
        }

        /* SKELETON */

        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-header-app', CcHeaderApp);
