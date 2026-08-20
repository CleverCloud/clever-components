import { css, html, LitElement } from 'lit';
import { i18n } from '../../translations/translation.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-dialog-confirm-actions/cc-dialog-confirm-actions.js';
import '../cc-dialog/cc-dialog.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-notice/cc-notice.js';
import {
  CcPostgresqlConnectionsKillEvent,
  CcPostgresqlDatabaseResetEvent,
  CcPostgresqlDirectHostGenerateEvent,
  CcPostgresqlExtensionActivateEvent,
  CcPostgresqlInstancesRebootEvent,
  CcPostgresqlPasswordResetEvent,
  CcPostgresqlReadOnlyUserCreateEvent,
  CcPostgresqlReplicaPromoteEvent,
} from './cc-postgresql-admin.events.js';

/**
 * @import { PostgresqlAdminAction, PostgresqlAdminState, PostgresqlAdminStateLoaded, PostgresqlConnectionsState, PostgresqlReadOnlyUser } from './cc-postgresql-admin.types.js'
 * @import { CcInputEvent } from '../common.events.js'
 * @import { PropertyValues, TemplateResult } from 'lit'
 */

/** Actions asking for a confirmation before being dispatched. */
const CONFIRMED_ACTIONS = [
  'kill-connections',
  'reset-password',
  'reset-database',
  'reboot-instances',
  'promote-replica',
];

/**
 * A component displaying the administration actions of a PostgreSQL add-on.
 *
 * ## Details
 *
 * * Sections are displayed depending on the capabilities of the add-on: shared and dedicated
 *   plans don't offer the same actions, and replication depends on the role of the node.
 * * Actions that cannot be undone ask for a confirmation before being dispatched.
 *
 * @cssdisplay block
 */
export class CcPostgresqlAdmin extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      _extension: { type: String, state: true },
      _isDialogOpen: { type: Boolean, state: true },
      _pendingAction: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {PostgresqlAdminState} Sets the state of the component */
    this.state = { type: 'loading' };

    /** @type {string} Sets the value of the extension input field */
    this._extension = '';

    /** @type {boolean} Whether the confirmation dialog is open */
    this._isDialogOpen = false;

    /** @type {PostgresqlAdminAction|null} The action the confirmation dialog is about */
    this._pendingAction = null;
  }

  /**
   * @param {PostgresqlAdminAction} action
   * @private
   */
  _requestAction(action) {
    if (CONFIRMED_ACTIONS.includes(action)) {
      this._pendingAction = action;
      this._isDialogOpen = true;
    } else {
      this._dispatchAction(action);
    }
  }

  /**
   * @param {PostgresqlAdminAction} action
   * @private
   */
  _dispatchAction(action) {
    switch (action) {
      case 'kill-connections':
        this.dispatchEvent(new CcPostgresqlConnectionsKillEvent());
        break;
      case 'reset-password':
        this.dispatchEvent(new CcPostgresqlPasswordResetEvent());
        break;
      case 'reset-database':
        this.dispatchEvent(new CcPostgresqlDatabaseResetEvent());
        break;
      case 'activate-extension':
        this.dispatchEvent(new CcPostgresqlExtensionActivateEvent({ extension: this._extension }));
        break;
      case 'add-read-only-user':
        this.dispatchEvent(new CcPostgresqlReadOnlyUserCreateEvent());
        break;
      case 'promote-replica':
        this.dispatchEvent(new CcPostgresqlReplicaPromoteEvent());
        break;
      case 'generate-direct-host':
        this.dispatchEvent(new CcPostgresqlDirectHostGenerateEvent());
        break;
      case 'reboot-instances':
        this.dispatchEvent(new CcPostgresqlInstancesRebootEvent());
        break;
    }
  }

  /**
   * @param {PostgresqlAdminAction|null} action
   * @returns {{heading: string, desc: string, submit: string, intent: 'primary'|'danger'}}
   * @private
   */
  _getConfirmation(action) {
    switch (action) {
      case 'kill-connections':
        return {
          heading: i18n('cc-postgresql-admin.connections.kill.confirm.heading'),
          desc: i18n('cc-postgresql-admin.connections.kill.confirm.desc'),
          submit: i18n('cc-postgresql-admin.connections.kill'),
          intent: 'danger',
        };
      case 'reset-password':
        return {
          heading: i18n('cc-postgresql-admin.password.reset.confirm.heading'),
          desc: i18n('cc-postgresql-admin.password.reset.confirm.desc'),
          submit: i18n('cc-postgresql-admin.password.reset'),
          intent: 'primary',
        };
      case 'reset-database':
        return {
          heading: i18n('cc-postgresql-admin.reset.confirm.heading'),
          desc: i18n('cc-postgresql-admin.reset.confirm.desc'),
          submit: i18n('cc-postgresql-admin.reset'),
          intent: 'danger',
        };
      case 'reboot-instances':
        return {
          heading: i18n('cc-postgresql-admin.reboot.confirm.heading'),
          desc: i18n('cc-postgresql-admin.reboot.confirm.desc'),
          submit: i18n('cc-postgresql-admin.reboot'),
          intent: 'danger',
        };
      case 'promote-replica':
        return {
          heading: i18n('cc-postgresql-admin.promote.confirm.heading'),
          desc: i18n('cc-postgresql-admin.promote.confirm.desc'),
          submit: i18n('cc-postgresql-admin.promote'),
          intent: 'primary',
        };
      default:
        return { heading: '', desc: '', submit: '', intent: 'primary' };
    }
  }

  /**
   * Only one action may run at a time.
   *
   * @param {PostgresqlAdminStateLoaded} state
   * @param {PostgresqlAdminAction} action
   * @returns {boolean}
   * @private
   */
  _isDisabled(state, action) {
    return state.runningAction != null && state.runningAction !== action;
  }

  /** @private */
  _onConfirm() {
    if (this._pendingAction != null) {
      this._dispatchAction(this._pendingAction);
    }
  }

  /** @private */
  _onDialogClose() {
    this._isDialogOpen = false;
  }

  /**
   * @param {CcInputEvent} event
   * @private
   */
  _onExtensionInput({ detail: extension }) {
    this._extension = extension;
  }

  /** @param {PropertyValues<CcPostgresqlAdmin>} changedProperties */
  updated(changedProperties) {
    // the action is over (successfully or not), the confirmation dialog is not relevant anymore
    const previousState = changedProperties.get('state');
    const wasRunning = previousState?.type === 'loaded' && previousState.runningAction != null;
    const isNotRunning = this.state.type !== 'loaded' || this.state.runningAction == null;
    if (wasRunning && isNotRunning) {
      this._isDialogOpen = false;
    }
  }

  render() {
    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-postgresql-admin.title')}</div>

        ${this.state.type === 'error'
          ? html`
              <cc-notice slot="content" intent="warning" message="${i18n('cc-postgresql-admin.error')}"></cc-notice>
            `
          : ''}
        ${this.state.type === 'loading'
          ? html`<cc-notice slot="content" intent="info" message="${i18n('cc-postgresql-admin.loading')}"></cc-notice>`
          : ''}
        ${this.state.type === 'loaded' ? this._renderContent(this.state) : ''}
      </cc-block>
    `;
  }

  /**
   * @param {PostgresqlAdminStateLoaded} state
   * @returns {TemplateResult}
   * @private
   */
  _renderContent(state) {
    const { capabilities } = state;

    return html`
      ${this._renderConnections(state)} ${capabilities.addReadOnlyUser ? this._renderReadOnlyUsers(state) : ''}
      ${capabilities.activateExtension ? this._renderExtension(state) : ''}
      ${capabilities.generateDirectHost ? this._renderDirectHost(state) : ''}
      ${capabilities.requestReplication ? this._renderReplication() : ''}
      ${capabilities.promoteReplica ? this._renderPromote(state) : ''}
      ${capabilities.resetPassword ? this._renderPassword(state) : ''}
      ${capabilities.resetDatabase || capabilities.rebootInstances ? this._renderDangerZone(state) : ''}
      ${this._renderConfirmDialog(state)}
    `;
  }

  /**
   * @param {PostgresqlAdminStateLoaded} state
   * @returns {TemplateResult}
   * @private
   */
  _renderConnections(state) {
    return html`
      <cc-block-section slot="content-body">
        <div slot="title">${i18n('cc-postgresql-admin.connections.title')}</div>
        <div slot="info">
          <p>${this._renderConnectionsCount(state.connections)}</p>
          <p>${i18n('cc-postgresql-admin.connections.kill.desc')}</p>
        </div>
        <div>
          <cc-button
            danger
            ?disabled=${this._isDisabled(state, 'kill-connections')}
            ?waiting=${state.runningAction === 'kill-connections'}
            @cc-click=${() => this._requestAction('kill-connections')}
            >${i18n('cc-postgresql-admin.connections.kill')}</cc-button
          >
        </div>
      </cc-block-section>
    `;
  }

  /**
   * @param {PostgresqlConnectionsState} connections
   * @private
   */
  _renderConnectionsCount(connections) {
    switch (connections.type) {
      case 'loading':
        return i18n('cc-postgresql-admin.connections.loading');
      case 'error':
        return i18n('cc-postgresql-admin.connections.error');
      case 'loaded':
        return i18n('cc-postgresql-admin.connections.count', { count: connections.count });
    }
  }

  /**
   * @param {PostgresqlAdminStateLoaded} state
   * @returns {TemplateResult}
   * @private
   */
  _renderReadOnlyUsers(state) {
    return html`
      <cc-block-section slot="content-body">
        <div slot="title">${i18n('cc-postgresql-admin.read-only-users.title')}</div>
        <div slot="info">${i18n('cc-postgresql-admin.read-only-users.desc')}</div>
        <div class="read-only-users">
          ${state.readOnlyUsers.map((readOnlyUser) => this._renderReadOnlyUser(readOnlyUser))}
          <div>
            <cc-button
              primary
              ?disabled=${this._isDisabled(state, 'add-read-only-user')}
              ?waiting=${state.runningAction === 'add-read-only-user'}
              @cc-click=${() => this._requestAction('add-read-only-user')}
              >${i18n('cc-postgresql-admin.read-only-users.create')}</cc-button
            >
          </div>
        </div>
      </cc-block-section>
    `;
  }

  /**
   * @param {PostgresqlReadOnlyUser} readOnlyUser
   * @returns {TemplateResult}
   * @private
   */
  _renderReadOnlyUser(readOnlyUser) {
    return html`
      <div class="read-only-user">
        <cc-input-text
          readonly
          clipboard
          label="${i18n('cc-postgresql-admin.read-only-users.user')}"
          value="${readOnlyUser.user}"
        ></cc-input-text>
        <cc-input-text
          readonly
          clipboard
          secret
          label="${i18n('cc-postgresql-admin.read-only-users.password')}"
          value="${readOnlyUser.password}"
        ></cc-input-text>
      </div>
    `;
  }

  /**
   * @param {PostgresqlAdminStateLoaded} state
   * @returns {TemplateResult}
   * @private
   */
  _renderExtension(state) {
    return html`
      <cc-block-section slot="content-body">
        <div slot="title">${i18n('cc-postgresql-admin.extension.title')}</div>
        <div slot="info">${i18n('cc-postgresql-admin.extension.desc')}</div>
        <div class="one-line-form">
          <cc-input-text
            label="${i18n('cc-postgresql-admin.extension.input')}"
            ?readonly=${state.runningAction != null}
            .value=${this._extension}
            @cc-input=${this._onExtensionInput}
            @cc-request-submit=${() => this._requestAction('activate-extension')}
          ></cc-input-text>
          <cc-button
            primary
            ?disabled=${this._isDisabled(state, 'activate-extension') || this._extension === ''}
            ?waiting=${state.runningAction === 'activate-extension'}
            @cc-click=${() => this._requestAction('activate-extension')}
            >${i18n('cc-postgresql-admin.extension.activate')}</cc-button
          >
        </div>
      </cc-block-section>
    `;
  }

  /**
   * @param {PostgresqlAdminStateLoaded} state
   * @returns {TemplateResult}
   * @private
   */
  _renderDirectHost(state) {
    return html`
      <cc-block-section slot="content-body">
        <div slot="title">${i18n('cc-postgresql-admin.direct-host.title')}</div>
        <div slot="info">${i18n('cc-postgresql-admin.direct-host.desc')}</div>
        <div>
          <cc-button
            primary
            ?disabled=${this._isDisabled(state, 'generate-direct-host')}
            ?waiting=${state.runningAction === 'generate-direct-host'}
            @cc-click=${() => this._requestAction('generate-direct-host')}
            >${i18n('cc-postgresql-admin.direct-host.generate')}</cc-button
          >
        </div>
      </cc-block-section>
    `;
  }

  /**
   * @returns {TemplateResult}
   * @private
   */
  _renderReplication() {
    return html`
      <cc-block-section slot="content-body">
        <div slot="title">${i18n('cc-postgresql-admin.replication.title')}</div>
        <div slot="info">${i18n('cc-postgresql-admin.replication.desc')}</div>
      </cc-block-section>
    `;
  }

  /**
   * @param {PostgresqlAdminStateLoaded} state
   * @returns {TemplateResult}
   * @private
   */
  _renderPromote(state) {
    return html`
      <cc-block-section slot="content-body">
        <div slot="title">${i18n('cc-postgresql-admin.promote.title')}</div>
        <div slot="info">${i18n('cc-postgresql-admin.promote.desc')}</div>
        <div>
          <cc-button
            primary
            ?disabled=${this._isDisabled(state, 'promote-replica')}
            ?waiting=${state.runningAction === 'promote-replica'}
            @cc-click=${() => this._requestAction('promote-replica')}
            >${i18n('cc-postgresql-admin.promote')}</cc-button
          >
        </div>
      </cc-block-section>
    `;
  }

  /**
   * @param {PostgresqlAdminStateLoaded} state
   * @returns {TemplateResult}
   * @private
   */
  _renderPassword(state) {
    return html`
      <cc-block-section slot="content-body">
        <div slot="title">${i18n('cc-postgresql-admin.password.title')}</div>
        <div slot="info">${i18n('cc-postgresql-admin.password.desc')}</div>
        <div>
          <cc-button
            primary
            ?disabled=${this._isDisabled(state, 'reset-password')}
            ?waiting=${state.runningAction === 'reset-password'}
            @cc-click=${() => this._requestAction('reset-password')}
            >${i18n('cc-postgresql-admin.password.reset')}</cc-button
          >
        </div>
      </cc-block-section>
    `;
  }

  /**
   * @param {PostgresqlAdminStateLoaded} state
   * @returns {TemplateResult}
   * @private
   */
  _renderDangerZone(state) {
    return html`
      <cc-block-section slot="content-body">
        <div slot="title" class="danger">${i18n('cc-postgresql-admin.danger-zone')}</div>
        <div slot="info">
          ${state.capabilities.resetDatabase ? html`<p>${i18n('cc-postgresql-admin.reset.desc')}</p>` : ''}
          ${state.capabilities.rebootInstances ? html`<p>${i18n('cc-postgresql-admin.reboot.desc')}</p>` : ''}
        </div>
        <div class="danger-actions">
          ${state.capabilities.resetDatabase
            ? html`
                <cc-button
                  danger
                  ?disabled=${this._isDisabled(state, 'reset-database')}
                  ?waiting=${state.runningAction === 'reset-database'}
                  @cc-click=${() => this._requestAction('reset-database')}
                  >${i18n('cc-postgresql-admin.reset')}</cc-button
                >
              `
            : ''}
          ${state.capabilities.rebootInstances
            ? html`
                <cc-button
                  danger
                  ?disabled=${this._isDisabled(state, 'reboot-instances')}
                  ?waiting=${state.runningAction === 'reboot-instances'}
                  @cc-click=${() => this._requestAction('reboot-instances')}
                  >${i18n('cc-postgresql-admin.reboot')}</cc-button
                >
              `
            : ''}
        </div>
      </cc-block-section>
    `;
  }

  /**
   * @param {PostgresqlAdminStateLoaded} state
   * @returns {TemplateResult}
   * @private
   */
  _renderConfirmDialog(state) {
    const confirmation = this._getConfirmation(this._pendingAction);

    return html`
      <cc-dialog
        slot="content-body"
        ?open=${this._isDialogOpen}
        heading="${confirmation.heading}"
        @cc-close=${this._onDialogClose}
        @cc-confirm=${this._onConfirm}
      >
        <p>${confirmation.desc}</p>
        <cc-dialog-confirm-actions
          submit-intent="${confirmation.intent}"
          submit-label="${confirmation.submit}"
          ?waiting=${state.runningAction != null}
        ></cc-dialog-confirm-actions>
      </cc-dialog>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        p {
          margin: 0 0 var(--cc-spacing-3, 0.5em);
        }

        p:last-child {
          margin-bottom: 0;
        }

        .one-line-form {
          display: flex;
        }

        .one-line-form cc-input-text {
          flex: 1 1 10em;
          margin-right: var(--cc-spacing-3, 0.5em);
        }

        .one-line-form cc-button {
          margin-top: var(--cc-margin-top-btn-horizontal-form);
        }

        .read-only-users {
          display: grid;
          gap: var(--cc-spacing-5, 1em);
        }

        .read-only-user {
          display: grid;
          gap: var(--cc-spacing-3, 0.5em);
          grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
        }

        .danger-actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--cc-spacing-3, 0.5em);
        }
      `,
    ];
  }
}

window.customElements.define('cc-postgresql-admin', CcPostgresqlAdmin);
