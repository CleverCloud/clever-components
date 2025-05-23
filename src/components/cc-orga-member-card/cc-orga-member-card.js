import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixAccountCircleFill as iconAvatar,
  iconRemixCheckFill as iconCheck,
  iconRemixCloseFill as iconCross,
  iconRemixDeleteBinLine as iconDelete,
  iconRemixErrorWarningFill as iconError,
  iconRemixEditFill as iconPen,
} from '../../assets/cc-remix.icons.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';
import '../cc-stretch/cc-stretch.js';
import {
  CcOrgaMemberDeleteEvent,
  CcOrgaMemberEditToggleEvent,
  CcOrgaMemberLeaveEvent,
  CcOrgaMemberUpdateEvent,
} from './cc-orga-member-card.events.js';

const BREAKPOINT_MEDIUM = 740;
const BREAKPOINT_SMALL = 580;
const BREAKPOINT_TINY = 350;

const BREAKPOINTS = [BREAKPOINT_TINY, BREAKPOINT_SMALL, BREAKPOINT_MEDIUM];

/**
 * @typedef {import('./cc-orga-member-card.types.js').CardAuthorisations} CardAuthorisations
 * @typedef {import('./cc-orga-member-card.types.js').OrgaMemberCardState} OrgaMemberCardState
 * @typedef {import('./cc-orga-member-card.types.js').ToggleEditing} ToggleEditing
 * @typedef {import('./cc-orga-member-card.types.js').OrgaMember} OrgaMember
 * @typedef {import('./cc-orga-member-card.types.js').OrgaMemberRole} OrgaMemberRole
 * @typedef {import('../cc-button/cc-button.js').CcButton} CcButton
 * @typedef {import('../cc-select/cc-select.js').CcSelect} CcSelect
 * @typedef {import('lit/directives/ref.js').Ref<CcButton>} RefCcButton
 * @typedef {import('lit/directives/ref.js').Ref<CcSelect>} RefCcSelect
 */

/**
 * A component showing information about a member from a given organisation.
 *
 * With the right authorisations:
 * - This component provides a way to delete the member from the organisation.
 * - This component provides a way to edit the role of the member within a given organisation.
 *
 * ## Technical Details
 *
 * This component heavily relies on `cc-stretch` to make sure all cards look the same whatever the role and MFA status may be.
 * This component also heavily relies on CSS `grid` and the `ResizeController` to switch from a "table" like design to a card design when the card width shrinks.
 *
 * @cssdisplay block
 */
export class CcOrgaMemberCard extends LitElement {
  static get properties() {
    return {
      authorisations: { type: Object },
      state: { type: Object },
      _newRole: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {CardAuthorisations} Sets the authorisations that control the display of the edit / delete buttons. */
    this.authorisations = {
      edit: false,
      delete: false,
    };

    /** @type {OrgaMemberCardState} Sets the state and data of the member. */
    this.state = {
      type: 'loaded',
      id: '',
      email: '',
      role: 'DEVELOPER',
      isMfaEnabled: false,
      isCurrentUser: false,
    };

    /** @type {RefCcButton} */
    this._deleteButtonRef = createRef();

    this._newRole = null;

    /** @type {RefCcSelect} */
    this._roleRef = createRef();

    /**
     * @type {ResizeController}
     * used to:
     * - wrap buttons when the component width is below 740.
     * - switch to a vertical card layout when the width is below 580.
     * - show buttons and badges below each other when the width is below 350.
     */
    this._resizeController = new ResizeController(this, {
      widthBreakpoints: BREAKPOINTS,
    });
  }

  /**
   * Focus the delete button within the card.
   * To be used when a card is removed, and you want to focus another card (LostFocusController used in `cc-orga-member-list`).
   */
  focusDeleteBtn() {
    this._deleteButtonRef.value.focus();
  }

  /*
   * Get the accessible name for the button that could be `edit` / `cancel editing`.
   * The accessible name provides more info than the visible text. It mentions the member being edited / to be edited.
   */
  _getFirstBtnAccessibleName() {
    const memberIdentity = this.state.name ?? this.state.email;
    if (this.state.type === 'editing' || this.state.type === 'updating') {
      return i18n('cc-orga-member-card.btn.cancel.accessible-name', { memberIdentity });
    } else {
      return i18n('cc-orga-member-card.btn.edit.accessible-name', { memberIdentity });
    }
  }

  /*
   * Get the accessible name for the button that could be `leave` / `delete` / `confirm editing`.
   * The accessible name provides more info than the visible text. It mentions the member to delete if relevant (no need to specify it for the "leave" button).
   */
  _getSecondBtnAccessibleName() {
    const memberIdentity = this.state.name ?? this.state.email;
    if (this.state.type === 'editing' || this.state.type === 'updating') {
      return i18n('cc-orga-member-card.btn.validate.accessible-name', { memberIdentity });
    }

    if (this.state.isCurrentUser) {
      return i18n('cc-orga-member-card.btn.leave.accessible-name');
    }

    return i18n('cc-orga-member-card.btn.delete.accessible-name', { memberIdentity });
  }

  _getRoleOptions() {
    return [
      { value: 'ADMIN', label: i18n('cc-orga-member-card.role.admin') },
      { value: 'DEVELOPER', label: i18n('cc-orga-member-card.role.developer') },
      { value: 'ACCOUNTING', label: i18n('cc-orga-member-card.role.accounting') },
      { value: 'MANAGER', label: i18n('cc-orga-member-card.role.manager') },
    ];
  }

  /**
   * @param {boolean} isEditing
   * @returns {string}
   * @private
   */
  _getSecondBtnVisibleElementId(isEditing) {
    if (isEditing) {
      return 'btn-content-validate';
    }

    if (this.state.isCurrentUser) {
      return 'btn-content-leave';
    }

    return 'btn-content-delete';
  }

  /**
   * @returns {OrgaMember}
   * @private
   */
  _getOrgaMember() {
    return {
      id: this.state.id,
      email: this.state.email,
      role: this.state.role,
      name: this.state.name,
      avatar: this.state.avatar,
      jobTitle: this.state.jobTitle,
      isMfaEnabled: this.state.isMfaEnabled,
      isCurrentUser: this.state.isCurrentUser,
    };
  }

  _onDeleteMember() {
    // since not every member has set a name, we send either the name or the email to provide context in the toast message
    if (this.state.isCurrentUser) {
      this.dispatchEvent(new CcOrgaMemberLeaveEvent(this._getOrgaMember()));
    } else {
      this.dispatchEvent(new CcOrgaMemberDeleteEvent(this._getOrgaMember()));
    }
  }

  /**
   * Update the newRole value when the select changes value.
   * We need to do this because we want to be able to reset the newRole when the user toggles the edit mode. (cancel editing)
   *
   * @param {CcSelectEvent<OrgaMemberRole>} event
   */
  _onRoleChange({ detail: value }) {
    this._newRole = value;
  }

  /**
   * Switch the state between `loaded` and `editing`.
   * Dispatch a `toggle-editing` event so that `cc-orga-member-list` may close all other cards in edit mode.
   * Focus the role `select` element after entering edit mode.
   */
  async _onToggleEdit() {
    const newState = this.state.type === 'loaded' ? 'editing' : 'loaded';

    // switch the component state
    this.state = {
      ...this.state,
      type: newState,
    };
    this._newRole = this.state.role;

    // warn the `cc-orga-member-list` component so that it closes all other cards.
    this.dispatchEvent(
      new CcOrgaMemberEditToggleEvent({
        memberId: this.state.id,
        newState,
      }),
    );

    /* Focus the `<select>` element when entering edit mode */
    if (newState === 'editing') {
      await this.updateComplete;
      this._roleRef.value.focus();
    }
  }

  _onUpdateMember() {
    if (this._newRole === this.state.role) {
      this._onToggleEdit();
      return;
    }

    this.dispatchEvent(
      new CcOrgaMemberUpdateEvent({
        id: this.state.id,
        email: this.state.email,
        role: this.state.role,
        name: this.state.name,
        avatar: this.state.avatar,
        jobTitle: this.state.jobTitle,
        isMfaEnabled: this.state.isMfaEnabled,
        isCurrentUser: this.state.isCurrentUser,
        newRole: this._newRole,
      }),
    );
  }

  render() {
    const waiting = this.state.type === 'updating' || this.state.type === 'deleting';
    const hasName = this.state.name != null;
    const hasError = (this.state.type === 'loaded' || this.state.type === 'editing') && this.state.error;
    const hasAdminRights = this.authorisations.edit && this.authorisations.delete;

    return html`
      <div class="wrapper ${classMap({ 'has-actions': hasAdminRights, 'has-error': hasError })}">
        ${this.state.avatar == null
          ? html` <cc-icon class="avatar ${classMap({ waiting })}" .icon=${iconAvatar}></cc-icon> `
          : html` <cc-img class="avatar ${classMap({ waiting })}" src=${this.state.avatar}></cc-img> `}
        <div class="identity ${classMap({ waiting })}" title="${ifDefined(this.state.jobTitle ?? undefined)}">
          ${hasName || this.state.isCurrentUser
            ? html`
                <p class="name">
                  ${hasName ? html`<strong>${this.state.name}</strong>` : ''}
                  ${this.state.isCurrentUser
                    ? html` <cc-badge>${i18n('cc-orga-member-card.current-user')}</cc-badge> `
                    : ''}
                </p>
              `
            : ''}
          <p class="email">${this.state.email}</p>
        </div>

        ${this._renderStatusArea()} ${hasAdminRights ? this._renderActionBtns(hasError) : ''}

        <!--
          a11y: we need the live region to be present within the DOM from the start and insert content dynamically inside it.
          We have to add a conditional class to the wrapper when it does not contain any message to cancel the gap applied automatically within the grid.
         -->
        <div class="error-wrapper ${classMap({ 'out-of-flow': !hasError })}" aria-live="polite" aria-atomic="true">
          ${hasError
            ? html`
                <cc-notice
                  intent="danger"
                  heading="${i18n('cc-orga-member-card.error.last-admin.heading')}"
                  message="${i18n('cc-orga-member-card.error.last-admin.text')}"
                  no-icon
                >
                </cc-notice>
              `
            : ''}
        </div>
      </div>
    `;
  }

  /**
   * This sub render heavily relies on `cc-stretch`:
   *
   * - to make sure all badges are centered in desktop within a column which size is based on the longest text present inside.
   * - to make sure there is no layout shifts when switching between edit and readonly modes.
   */
  _renderStatusArea() {
    const isEditing = this.state.type === 'editing' || this.state.type === 'updating';
    const waiting = this.state.type === 'updating' || this.state.type === 'deleting';

    return html`
      <cc-stretch
        class="status ${classMap({ waiting })}"
        visible-element-id=${isEditing ? 'status-editing' : 'status-readonly'}
      >
        <div id="status-readonly" class="status__role-mfa">
          <cc-stretch visible-element-id=${this.state.role}>
            ${this._getRoleOptions().map(
              (role) => html` <cc-badge id="${role.value}" intent="info" weight="dimmed">${role.label}</cc-badge> `,
            )}
          </cc-stretch>

          <cc-stretch visible-element-id=${this.state.isMfaEnabled ? 'badge-mfa-enabled' : 'badge-mfa-disabled'}>
            <cc-badge id="badge-mfa-enabled" intent="success" weight="outlined" .icon="${iconCheck}">
              ${i18n('cc-orga-member-card.mfa-enabled')}
            </cc-badge>
            <cc-badge id="badge-mfa-disabled" intent="danger" weight="outlined" .icon="${iconError}">
              ${i18n('cc-orga-member-card.mfa-disabled')}
            </cc-badge>
          </cc-stretch>
        </div>

        <cc-select
          id="status-editing"
          label="${i18n('cc-orga-member-card.role.label')}"
          .options=${this._getRoleOptions()}
          .value=${this._newRole ?? this.state.role}
          ?inline=${this._resizeController.width > BREAKPOINT_TINY}
          ?disabled=${this.state.type === 'updating'}
          @cc-select=${this._onRoleChange}
          ${ref(this._roleRef)}
        >
        </cc-select>
      </cc-stretch>
    `;
  }

  /**
   * This sub render also relies on `cc-stretch` to make sure buttons have the same size whatever their visible text may be (edit vs readonly mode).
   * We rely on the `a11y-name` prop on `cc-button` to make sure assistive get the relevant text with some context in addition.
   *
   * @param {boolean} hasError
   */
  _renderActionBtns(hasError) {
    const isBtnImgOnly = this._resizeController.width >= BREAKPOINT_MEDIUM;
    const waiting = this.state.type === 'updating' || this.state.type === 'deleting';
    const isEditing = this.state.type === 'editing' || this.state.type === 'updating';
    const firstBtnIcon = isEditing ? iconCross : iconPen;
    const secondBtnIcon = isEditing ? iconCheck : iconDelete;

    return html`
      <div class="actions">
        <cc-button
          ?primary=${!isEditing}
          outlined
          .icon=${firstBtnIcon}
          ?circle=${isBtnImgOnly}
          ?disabled=${waiting}
          ?hide-text=${isBtnImgOnly}
          a11y-name=${this._getFirstBtnAccessibleName()}
          @cc-click=${this._onToggleEdit}
        >
          <cc-stretch visible-element-id=${isEditing ? 'btn-content-cancel' : 'btn-content-edit'}>
            <span id="btn-content-edit">${i18n('cc-orga-member-card.btn.edit.visible-text')}</span>
            <span id="btn-content-cancel">${i18n('cc-orga-member-card.btn.cancel.visible-text')}</span>
          </cc-stretch>
        </cc-button>

        <cc-button
          ?danger=${!isEditing}
          ?primary=${isEditing}
          outlined
          .icon=${secondBtnIcon}
          ?disabled=${hasError}
          ?circle=${isBtnImgOnly}
          ?hide-text=${isBtnImgOnly}
          ?waiting=${waiting}
          a11y-name=${this._getSecondBtnAccessibleName()}
          @cc-click=${isEditing ? this._onUpdateMember : this._onDeleteMember}
          ${ref(this._deleteButtonRef)}
        >
          <cc-stretch visible-element-id=${this._getSecondBtnVisibleElementId(isEditing)}>
            <span id="btn-content-leave">${i18n('cc-orga-member-card.btn.leave.visible-text')}</span>
            <span id="btn-content-delete">${i18n('cc-orga-member-card.btn.delete.visible-text')}</span>
            <span id="btn-content-validate">${i18n('cc-orga-member-card.btn.validate.visible-text')}</span>
          </cc-stretch>
        </cc-button>
      </div>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        /* region big (>= 740) & global */
        :host {
          display: block;
        }

        .wrapper {
          align-items: center;
          display: grid;
          gap: 0.8em 1em;
        }

        :host([w-gte-740]) .wrapper {
          grid-template-areas: 'avatar identity status';
          grid-template-columns: max-content 1fr max-content;
        }

        :host([w-gte-740]) .wrapper.has-actions {
          grid-template-areas: 'avatar identity status actions';
          grid-template-columns: max-content 1fr max-content max-content;
        }

        :host([w-gte-740]) .wrapper.has-actions.has-error {
          grid-template-areas:
            'avatar identity status actions'
            '. error error error';
        }

        :host(.editing) .actions cc-button {
          --cc-icon-size: 1.4em;
        }

        p {
          margin: 0;
        }

        .avatar {
          --cc-icon-color: #595959;

          clip-path: circle(50% at 50% 50%);
          grid-area: avatar;
          height: 3em;
          width: 3em;
        }

        .identity {
          display: flex;
          flex-direction: column;
          gap: 0.3em;
          grid-area: identity;
          /* makes the email address wrap if needed */
          word-break: break-all;
        }

        .name {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .status {
          grid-area: status;
        }

        .status cc-badge {
          white-space: nowrap;
          width: 100%;
        }

        .actions {
          display: flex;
          gap: 0.5em;
          grid-area: actions;
          justify-content: space-evenly;
          min-width: 4em;
        }

        .status__role-mfa {
          align-items: center;
          display: flex;
          gap: 0.5em 1em;
        }

        .error-wrapper {
          display: flex;
          /* always leave the first column containing only the avatar. */
          grid-area: error;
          justify-content: end;
        }

        /* This is to cancel the grid gap when there is no error message. */

        .error-wrapper.out-of-flow {
          grid-area: avatar;
        }

        .waiting {
          opacity: var(--cc-opacity-when-disabled, 0.65);
        }
        /* endregion */

        /* region medium (< 740) */

        :host([w-lt-740]) .wrapper {
          grid-template-areas: 'avatar identity status';
          grid-template-columns: max-content 1fr;
        }

        :host([w-lt-740]) .wrapper.has-actions {
          grid-template-areas:
            'avatar identity status'
            '. . actions';
        }

        :host([w-lt-740]) .wrapper.has-actions.has-error {
          grid-template-areas:
            'avatar identity status'
            '. . actions'
            '. error error';
        }

        :host([w-lt-740]) .status,
        :host([w-lt-740]) .actions {
          justify-self: end;
        }

        :host([w-lt-740]) .error {
          margin-top: 0.5em;
        }
        /* endregion */

        /* region small (< 580) */

        :host([w-lt-580]) .wrapper {
          grid-template-areas:
            'avatar identity'
            '. status';
          grid-template-columns: max-content 1fr;
        }

        :host([w-lt-580]) .wrapper.has-actions {
          grid-template-areas:
            'avatar identity'
            '. status'
            '. actions';
        }

        :host([w-lt-580]) .wrapper.has-actions.has-error {
          grid-template-areas:
            'avatar identity'
            '. status'
            '. actions'
            '. error';
        }

        :host([w-lt-580]) .status {
          justify-self: start;
        }

        :host([w-lt-580]) .actions {
          justify-self: start;
        }
        /* endregion */

        /* region tiny (< 350) */

        :host([w-lt-350]) .status,
        :host([w-lt-350]) cc-select {
          width: 100%;
        }

        :host([w-lt-350]) .actions {
          flex-direction: column;
          justify-self: stretch;
        }

        :host([w-lt-350]) .status__role-mfa {
          align-items: flex-start;
          flex-direction: column;
          width: 100%;
        }
        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-orga-member-card', CcOrgaMemberCard);
