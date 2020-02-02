import '../atoms/cc-button.js';
import '../molecules/cc-error.js';
import gitSvg from './git.svg';
import restartFailedSvg from './restart-failed.svg';
import restartingSvg from './restarting.svg';
import restartingWithDowntimeSvg from './restarting-with-downtime.svg';
import runningSvg from './running.svg';
import startFailedSvg from './start-failed.svg';
import startingSvg from './starting.svg';
import stoppedSvg from './stopped.svg';
import unknownSvg from './unknown.svg';
import { ccLink, linkStyles } from '../templates/cc-link.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { skeleton } from '../styles/skeleton.js';

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

/**
 * A component to display various info about an app (name, commits, status...).
 *
 * ## Details
 *
 * * When `app` and `status` are null, a skeleton screen UI pattern is displayed (loading hint).
 * * When only `status` is null, a skeleton screen UI pattern is displayed on the buttons and status message.
 *
 * ## Type definitions
 *
 * ```js
 * interface App {
 *   name: string,                   // Name of the application
 *   commit?: string,                // Head commit on remote repo if app is not brand new (full SHA-1)
 *   variantName: string,            // Human name of the variant (PHP, Ruby, Python...)
 *   variantLogo: string,            // HTTPS URL to the logo of the variant
 *   lastDeploymentLogsUrl?: string, // URL to the logs for the last deployment if app is not brand new
 * }
 * ```
 *
 * ```js
 * type AppStatus = "restart-failed" | "restarting" | "restarting-with-downtime"
 *                  | "running" | "start-failed" | "starting" | "stopped" | "unknown"
 * ```
 *
 * @prop {App} app - Sets application details and config.
 * @prop {Boolean} disableButtons - Disables all buttons (in a "login as" use case).
 * @prop {Boolean} error - Displays an error message.
 * @prop {String} runningCommit - Sets the running commit (if app is running).
 * @prop {String} startingCommit - Sets the starting commit (if app is deploying).
 * @prop {AppStatus} status - Sets application status.
 *
 * @event {CustomEvent} cc-header-app:cancel - Fires whenever the cancel button is clicked.
 * @event {CustomEvent} cc-header-app:restart - Fires whenever one of the 3 restart buttons is clicked.
 * @event {CustomEvent} cc-header-app:start - Fires whenever one of the 3 start buttons is clicked.
 * @event {CustomEvent} cc-header-app:stop - Fires whenever the stop button is clicked (after the delay).
 */
export class CcHeaderApp extends LitElement {

  static get properties () {
    return {
      app: { type: Object, attribute: false },
      disableButtons: { type: Boolean, attribute: 'disable-buttons', reflect: true },
      error: { type: Boolean, reflect: true },
      runningCommit: { type: String, attribute: 'running-commit' },
      startingCommit: { type: String, attribute: 'starting-commit' },
      status: { type: String },
      _lastUserAction: { type: String, attribute: false },
    };
  }

  constructor () {
    super();
    this.disableButtons = false;
    this.error = false;
  }

  set status (newVal) {
    const oldVal = this._status;
    this._lastUserAction = (this.status !== newVal)
      ? null
      : this._lastUserAction;
    this._status = newVal;
    this.requestUpdate('status', oldVal);
  }

  get status () {
    return this._status;
  }

  static get skeletonApp () {
    return {
      name: '??????????????????????????',
      commit: '????????????????????????????????????????',
    };
  }

  static get skeletonStatus () {
    return 'unknown';
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

  _renderCommit (commit, type, skeleton) {
    if (commit == null && type !== 'git') {
      return '';
    }
    return html`
      <span
        class="commit-item ${classMap({ 'is-deploying': (type === 'starting') })}"
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

  render () {

    // Quick short circuit for errors
    if (this.error) {
      return html`<cc-error>${i18n('cc-header-app.error')}</cc-error>`;
    }

    const skeleton = (this.app == null);
    const { name, commit, variantName, variantLogo, lastDeploymentLogsUrl } = skeleton ? CcHeaderApp.skeletonApp : this.app;
    const skeletonStatus = (this.status == null);
    const status = skeletonStatus ? CcHeaderApp.skeletonStatus : this.status;

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
      
      <div class="messages ${classMap({ 'is-deploying': isDeploying })}">
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
      </div>
    `;
  }

  static get styles () {
    return [
      skeleton,
      linkStyles,
      // language=CSS
      css`
        :host {
          background-color: #fff;
          border-radius: 0.25rem;
          border: 1px solid #bcc2d1;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
        }

        cc-error {
          padding: 1rem;
          text-align: center;
        }

        .main {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .flavor-logo {
          border-radius: 0.25rem;
          align-self: flex-start;
          height: 3.25rem;
          margin: 1rem;
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
          flex-direction: column;
          flex: 1 1 0;
          min-height: 3rem;
          margin: 1rem 1rem 1rem 0;
          justify-content: space-between;
        }

        .name {
          font-weight: bold;
          font-size: 1.1rem;
          min-width: 12rem;
        }

        .commits {
          display: flex;
          flex-wrap: wrap;
        }

        .commit-item {
          align-items: flex-start;
          display: flex;
          margin-right: 0.75rem;
          margin-top: 0.5rem;
        }

        .commit-item[data-type="git"] {
          color: #5D5D5D;
        }

        .commit-item[data-type="running"] {
          color: #2faa60;
        }

        .commit-item[data-type="starting"] {
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
          display: flex;
          flex-wrap: wrap;
          padding: 0.5rem 1rem 0.5rem 0;
        }

        cc-button {
          flex: 1 1 auto;
          margin: 0.5rem 0 0.5rem 1rem;
          min-width: 0;
        }

        :host([disable-buttons]) cc-button {
          cursor: not-allowed;
        }

        /* TODO FACTOR */
        @keyframes deploying {
          from {
            opacity: 0.85;
          }

          to {
            opacity: 1;
          }
        }

        .messages {
          background-color: #f1f5ff;
          box-shadow: inset 0 6px 6px -6px #a4b1c9;
          box-sizing: border-box;
          color: #2e2e2e;
          font-size: 0.9rem;
          font-style: italic;
          padding: 0.4rem 1rem;
        }

        /* used on commits and messages */
        .is-deploying {
          animation-direction: alternate;
          animation-duration: 500ms;
          animation-iteration-count: infinite;
          animation-name: deploying;
        }

        .status-icon {
          height: 1.25rem;
          vertical-align: middle;
          min-width: 1.25rem;
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
