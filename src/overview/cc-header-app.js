import '../atoms/cc-button.js';
import '../atoms/cc-flex-gap.js';
import '../molecules/cc-error.js';
import '../zones/cc-zone.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { skeletonStyles } from '../styles/skeleton.js';
import { waitingStyles } from '../styles/waiting.js';
import { ccLink, linkStyles } from '../templates/cc-link.js';

const gitSvg = new URL('../assets/git.svg', import.meta.url).href;
const restartFailedSvg = new URL('../assets/restart-failed.svg', import.meta.url).href;
const restartingWithDowntimeSvg = new URL('../assets/restarting-with-downtime.svg', import.meta.url).href;
const restartingSvg = new URL('../assets/restarting.svg', import.meta.url).href;
const runningSvg = new URL('../assets/running.svg', import.meta.url).href;
const startFailedSvg = new URL('../assets/start-failed.svg', import.meta.url).href;
const startingSvg = new URL('../assets/starting.svg', import.meta.url).href;
const stoppedSvg = new URL('../assets/stopped.svg', import.meta.url).href;
const unknownSvg = new URL('../assets/unknown.svg', import.meta.url).href;

const commitIcon = {
  git: gitSvg,
  running: runningSvg,
  starting: startingSvg,
};

const statusIcon = {
  'restart-failed': restartFailedSvg,
  restarting: restartingSvg,
  'restarting-with-downtime': restartingWithDowntimeSvg,
  running: runningSvg,
  'start-failed': startFailedSvg,
  starting: startingSvg,
  stopped: stoppedSvg,
};

const SKELETON_APP = {
  name: '??????????????????????????',
  commit: '????????????????????????????????????????',
};

const SKELETON_STATUS = 'unknown';

/**
 * A component to display various info about an app (name, commits, status...).
 *
 * ## Details
 *
 * * When `app` and `status` are null, a skeleton screen UI pattern is displayed (loading hint).
 * * When only `status` is null, a skeleton screen UI pattern is displayed on the buttons and status message.
 *
 * @typedef {import('../types.js').App} App
 * @typedef {import('../types.js').AppStatus} AppStatus
 * @typedef {import('../types.js').Zone} Zone
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
      _lastUserAction: { type: String, attribute: false },
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

  update (changeProperties) {
    if (changeProperties.has('status')) {
      this._lastUserAction = (changeProperties.get('status') !== this.status)
        ? null
        : this._lastUserAction;
    }
    super.update(changeProperties);
  }

  render () {

    // Quick short circuit for errors
    if (this.error) {
      return html`<cc-error>${i18n('cc-header-app.error')}</cc-error>`;
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
      <cc-flex-gap class="main">
        <div class="flavor-logo ${classMap({ skeleton })}" title=${ifDefined(variantName)}>
          <!-- image has a presentation role => alt="" -->
          <img class="flavor-logo_img" src=${ifDefined(variantLogo)} alt="">
        </div>

        <div class="details">
          <div class="name"><span class=${classMap({ skeleton })}>${name}</span></div>
          <cc-flex-gap class="commits">
            ${this._renderCommit(commit, 'git', skeleton)}
            ${isRunning ? this._renderCommit(this.runningCommit, 'running', skeleton) : ''}
            ${isDeploying ? this._renderCommit(this.startingCommit, 'starting', skeleton) : ''}
          </cc-flex-gap>
        </div>

        <cc-flex-gap class="buttons">

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

        </cc-flex-gap>
      </cc-flex-gap>

      <cc-flex-gap class="messages ${classMap({ 'cc-waiting': isDeploying })}">
        ${(shouldDisplayStatusMessage) ? html`
          <!-- image has a presentation role => alt="" -->
          <img class="status-icon" src=${statusIcon[status] || unknownSvg} alt="">
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
      </cc-flex-gap>
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
        <!-- image has a presentation role => alt="" -->
        <img class="commit_img" src=${commitIcon[type]} alt="">
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
          --cc-gap: 1rem;
          background-color: #fff;
          border: 1px solid #bcc2d1;
          border-radius: 0.25rem;
          display: block;
        }

        cc-error {
          padding: var(--cc-gap);
          text-align: center;
        }

        .main {
          padding: var(--cc-gap);
        }

        .flavor-logo {
          align-self: flex-start;
          border-radius: 0.25rem;
          height: 3.25rem;
          overflow: hidden;
          width: 3.25rem;
        }

        .flavor-logo_img {
          display: block;
          height: 100%;
          width: 100%;
        }

        .skeleton .flavor-logo_img {
          opacity: 0;
        }

        .details {
          display: flex;
          flex: 1 1 0;
          flex-direction: column;
          justify-content: space-between;
        }

        .name {
          font-size: 1.1rem;
          font-weight: bold;
          min-width: 12rem;
        }

        .commit {
          align-items: flex-start;
          display: flex;
        }

        .commit[data-type="git"] {
          color: #5D5D5D;
        }

        .commit[data-type="running"] {
          color: #2faa60;
        }

        .commit[data-type="starting"] {
          color: #2b96fd;
        }

        .commit_img {
          height: 1.1rem;
          margin-right: 0.2rem;
          overflow: hidden;
          width: 1.1rem;
        }

        /* We hide the right part of the commit this way so this can be part of a copy/paste */
        .commit_rest {
          font-size: 0;
        }

        .buttons {
          align-self: center;
        }

        cc-button {
          flex: 1 1 auto;
          min-width: 0;
        }

        :host([disable-buttons]) cc-button {
          cursor: not-allowed;
        }

        .messages {
          --cc-gap: 0.5rem;
          --cc-align-items: center;
          align-items: center;
          background-color: #f1f5ff;
          box-shadow: inset 0 6px 6px -6px #a4b1c9;
          box-sizing: border-box;
          color: #2e2e2e;
          font-size: 0.9rem;
          font-style: italic;
          padding: 0.4rem 1rem;
        }

        .status-icon {
          height: 1.25rem;
          min-width: 1.25rem;
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
