import { css, html, LitElement } from 'lit';
import { live } from 'lit/directives/live.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import '../cc-block/cc-block.js';
import '../cc-orga-member-card/cc-orga-member-card.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import '../cc-button/cc-button.js';
import '../cc-badge/cc-badge.js';
import '../cc-error/cc-error.js';
import '../cc-select/cc-select.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';
import { validateEmailAddress } from '../../lib/email.js';
import { classMap } from 'lit/directives/class-map.js';
import { LostFocusController } from "../../controllers/lost-focus-controller.js";

/**
 * @typedef {import('./cc-orga-member-list.types.js').InviteMemberFormState} InviteMemberFormState
 * @typedef {import('./cc-orga-member-list.types.js').StateMemberInvite} StateMemberInvite
 */

/**
 * A component displaying the list of members from an organisation.
 * The list can be filtered by name or email. One can also choose to display only users with Tfa disabled.
 *
 * @event {CustomEvent<InviteMemberPayload>} cc-orga-member-list:invite - Fires the `email` and `role` information inside an object whenever the invite button is clicked.
 *
 * @cssdisplay block
 */

export class CcOrgaMemberList extends LitElement {

  static get properties () {
    return {
      inviteMemberForm: { type: Object },
      members: { type: Object }
    };
  }

  // TODO: discuss the idea of exposing the init sate here or as a const => si ça marche pas, on fait un static get comme d'hab
  static INVITE_FORM_INIT_STATE = {
    state: 'idle',
    email: {
      value: '',
    },
    role: {
      value: 'DEVELOPER',
    },
  };

  constructor () {
    super();

    /** @type {InviteMemberFormState} Sets the state of the member invite form. */
    this.inviteMemberForm = CcOrgaMemberList.INVITE_FORM_INIT_STATE;

    /** @type {OrgaMemberListState} Sets the state of the member list. */
    this.members = { state: 'loading' };

    new LostFocusController(this, 'cc-orga-member-card', ({ suggestedElement }) => {
      if (suggestedElement == null) {
        this._noResultMessageRef.value?.focus();
      }
      suggestedElement?.focusDeleteBtn();
    });

    this._inviteMemberEmailRef = createRef();
    this._inviteMemberRoleRef = createRef();
    this._noResultMessageRef = createRef();
  }

  _getRoles () {
    return [
      { value: 'ADMIN', label: i18n('cc-orga-member-list.invite.role-admin') },
      { value: 'DEVELOPER', label: i18n('cc-orga-member-list.invite.role-developer') },
      { value: 'ACCOUNTING', label: i18n('cc-orga-member-list.invite.role-accounting') },
      { value: 'MANAGER', label: i18n('cc-orga-member-list.invite.role-manager') },
    ];
  }

  /**
   * @param {OrgaMemberCardState[]} members
   * @param {string} identityFilter
   * @param {boolean} mfaFilter
   * @return {OrgaMemberCardState[]}
   * @private
   */
  _getFilteredMemberList (members, identityFilter, mfaFilter) {
    const filteredMemberList = members.filter((member) => {

      const matchIdentity = identityFilter === ''
        || member.name?.toLowerCase().includes(identityFilter)
        || member.email.toLowerCase().includes(identityFilter);

      const matchMfaDisabled = !mfaFilter || !member.isMfaEnabled;

      return matchIdentity && matchMfaDisabled;
    });

    return filteredMemberList;
  }

  _onSubmit () {

    const existingEmails = this.members.value.map((m) => m.email);
    const email = this._inviteMemberEmailRef.value.value;
    const role = this._inviteMemberRoleRef.value.value;

    // TODO: maybe move the list and duplication detection in the validateEmailAddress
    const duplicateEmailError = existingEmails.includes(email) ? 'duplicate' : null;
    const emailError = validateEmailAddress(email) ?? duplicateEmailError;

    // We need to re-apply the value retrieve from the DOM via refs to the template (with potential errors)
    this.inviteMemberForm = {
      ...this.inviteMemberForm,
      email: {
        value: email,
        error: emailError,
      },
      role: {
        value: role,
      },
    };

    /*TODO should we introduce null in the data model then ?*/
    if (emailError == null) {
      dispatchCustomEvent(this, 'invite', { email, role });
    }
  }

  _onFilterIdentity ({ detail: value }) {
    this.members = {
      ...this.members,
      identityFilter: value?.trim().toLowerCase()
    }
  }

  _onFilterMfa () {
    this.members = {
      ...this.members,
      mfaFilter: !this.members.mfaFilter,
    }
  }

  /*TODO Document*/
  _getAdminList () {
    return this.members.value.filter((m) => m.role === 'ADMIN');
  }

  /*TODO Document*/
  _checkIsLastAdmin (event) {
    const adminList = this._getAdminList();
    if (adminList.length === 1 && adminList[0].id === event.detail.memberId) {
      event.stopPropagation();
      this.members = {
        ...this.members,
        value: this.members.value.map((member) => {
          return (member.id === event.detail.memberId)
              ? { ...member, error: 'last-admin' }
              : { ...member };
        }),
      }
    }
  }

  _onToggleCardEditing ({ detail: { memberId, newState } }) {
    this.members = {
      ...this.members,
      value: this.members.value.map((member) => {
        return (member.id === memberId)
          ? { ...member, state: newState }
          : { ...member, state: 'loaded' };
      }),
    };
  }

  /*TODO Document*/
  resetLastAdminErrors () {
    const adminList = this._getAdminList();
    if (adminList.length > 1) {
      this.members = {
        ...this.members,
        value: this.members.value.map((member) => ({
          ...member,
          error: null,
        })),
      }
    }
  }

  render () {
    return html`

      ${this._renderInviteForm()}

      <cc-block>

        <div slot="title">
          ${i18n('cc-orga-member-list.heading')}
          ${this.members.state === 'loaded' ? html`
            <cc-badge class="member-count" weight="dimmed" intent="neutral" circle>${this.members.value.length}</cc-badge>
          ` : ''}
        </div>

        ${this.members.state === 'loading' ? html`
          <cc-loader></cc-loader>
        ` : ''}

        ${this.members.state === 'loaded' ? html`
          ${this._renderLoaded(this.members.value, this.members.identityFilter, this.members.mfaFilter)}
        ` : ''}

        ${this.members.state === 'error' ? html`
          <cc-error>${i18n('cc-orga-member-list.error')}</cc-error>
        ` : ''}
      </cc-block>
    `;
  }

  _renderInviteForm () {

    const isFormDisabled = this.inviteMemberForm.state === 'inviting';

    return html`
      <cc-block>
        <div slot="title">${i18n('cc-orga-member-list.invite.heading')}</div>
        <p class="info">${i18n('cc-orga-member-list.invite.info')}</p>
        <!-- todo: do we need this form tag right now? -->
        <form class="invite-form">

          <cc-input-text
            label=${i18n('cc-orga-member-list.invite.email-label')}
            .value=${live(this.inviteMemberForm.email.value)}
            required
            ?disabled=${isFormDisabled}
            @cc-input-text:requestimplicitsubmit=${this._onSubmit}
            ${ref(this._inviteMemberEmailRef)}
          >
            <p slot="help">${i18n('cc-orga-member-list.invite.email-format')}</p>
            ${this._renderFormEmailError()}
          </cc-input-text>

          <cc-select
            label=${i18n('cc-orga-member-list.invite.role-label')}
            .options=${this._getRoles()}
            .value=${live(this.inviteMemberForm.role.value)}
            required
            ?disabled=${isFormDisabled}
            ${ref(this._inviteMemberRoleRef)}
          >
          </cc-select>

          <div class="submit">
            <cc-button primary ?waiting=${isFormDisabled} @cc-button:click=${this._onSubmit}>
              ${i18n('cc-orga-member-list.invite.submit')}
            </cc-button>
          </div>
        </form>
      </cc-block>
    `;
  }

  _renderFormEmailError () {
    switch (this.inviteMemberForm.email.error) {
      case 'empty':
        return html`<p slot="error">${i18n('cc-orga-member-list.invite.email-error-empty')}</p>`;
      case 'invalid':
        return html`<p slot="error">${i18n('cc-orga-member-list.invite.email-error-format')}</p>`;
      case 'duplicate':
        return html`<p slot="error">${i18n('cc-orga-member-list.invite.email-error-duplicate')}</p>`;
    }
    return html``;
  }

  /**
   * @param {OrgaMemberCardState[]} memberList
   * @param {string} identityFilter
   * @param {boolean} mfaFilter
   * @return {TemplateResult<1>}
   * @private
   */
  _renderLoaded (memberList, identityFilter, mfaFilter) {

    const containsAtLeast2Members = memberList.length >= 2;
    const containsDisabledMfa = memberList.some((member) => !member.isMfaEnabled);
    const filteredMemberList = this._getFilteredMemberList(memberList, identityFilter, mfaFilter);
    const isMemberListEmpty = filteredMemberList.length === 0;
    this.resetLastAdminErrors();

    return html`
      ${containsAtLeast2Members ? html`
        <div class="filters">
          <cc-input-text
            label=${i18n('cc-orga-member-list.filter-name')}
            .value=${identityFilter}
            @cc-input-text:input=${this._onFilterIdentity}
          ></cc-input-text>
          ${containsDisabledMfa ? html`
            <label class="filters__mfa" for="filter-mfa">
              <input id="filter-mfa" type="checkbox" @change=${this._onFilterMfa} .checked=${mfaFilter}>
              ${i18n('cc-orga-member-list.mfa-label')}
            </label>
          ` : ''}
        </div>
      ` : ''}

      <div class="member-list">

        ${repeat(filteredMemberList, (member) => member.id, (member) => html`
          <cc-orga-member-card
            class=${classMap({ 'editing': member.state === 'editing'})}
            .member=${member}
            @cc-orga-member-card:toggle-editing=${this._onToggleCardEditing}
            @cc-orga-member-card:update=${this._checkIsLastAdmin}
            @cc-orga-member-card:delete=${this._checkIsLastAdmin}
          ></cc-orga-member-card>
        `)}

        ${isMemberListEmpty ? html`
          <p ${ref(this._noResultMessageRef)} tabindex="-1">
            ${i18n('cc-orga-member-list.no-result')}
          </p>
        ` : ''}
      </div>
    `;
  }

  static get styles () {
    return [
      linkStyles,
      // language=CSS
      css`
        :host {
          display: flex;
          flex-direction: column;
          gap: 2em;
        }

        .member-count {
          font-size: 0.8em;
          margin-left: 0.2em;
          padding: 0.1em;
        }

        /*region invite form */
        .invite-form {
          align-items: flex-start;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .field-group {
          display: flex;
          flex-flow: row wrap;
          gap: 1em;
          margin-bottom: 1em;
        }

        .info {
          font-style: italic;
          margin: 0.5em 0;
        }

        .invite-form cc-input-text {
          flex: 100 1 18em;
        }

        .invite-form cc-select {
          flex: 1 1 max-content;
        }

        .submit {
          display: flex;
          justify-content: flex-end;
          width: 100%;
        }

        .filters__mfa {
          align-items: center;
          display: flex;
          gap: 0.3em;
        }

        .filters__mfa input {
          height: 0.9em;
          width: 0.9em;
        }
        /*endregion */

        /*region member list  */
        cc-badge {
          font-size: 0.7em;
          vertical-align: middle;
        }

        .member-list {
          display: flex;
          flex-direction: column;
          gap: 1.5em;
        }

        .filters cc-input-text {
          width: min(100%, 25em);
        }

        .filters {
          align-items: end;
          display: flex;
          flex-wrap: wrap;
          gap: 1em 0.5em;
          justify-content: space-between;
          margin-bottom: 0.25em;
          position: relative;
        }

        label input {
          margin: 0;
        }

        .editing {
          background-color: var(--cc-color-bg-neutral);
          box-shadow: 0 0 0 1em var(--cc-color-bg-neutral);
        }

        .error {
          align-items: center;
          display: flex;
          gap: 1em;
          justify-content: center;
        }

        .error img {
          height: 1.5em;
          width: 1.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-orga-member-list', CcOrgaMemberList);
