import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { validateEmailAddress } from '../../lib/email.js';
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

/**
 * @typedef {import('./cc-orga-member-list.types.js').OrgaMemberInviteFormState} OrgaMemberInviteFormState
 * @typedef {import('./cc-orga-member-list.types.js').OrgaMemberListState} OrgaMemberListState
 * @typedef {import('./cc-orga-member-list.types.js').Authorisations} Authorisations
 */

/**
 * A component displaying the list of the members belonging to a given organisation.
 * The list can be filtered by name or email.
 * One can also choose to only show users with Two-Factor Auth (2FA) disabled.
 *
 * Depending on the authorisations:
 *
 *  - Users may remove members,
 *  - Users may edit the role of members.
 *
 *
 * @event {CustomEvent<InviteMember>} cc-orga-member-list:invite - Fires the `email` and `role` information inside an object whenever the invite button is clicked.
 *
 * @cssdisplay flex
 */

export class CcOrgaMemberList extends LitElement {

  static get properties () {
    return {
      authorisations: { type: Object },
      inviteMemberForm: { type: Object },
      members: { type: Object },
    };
  }

  static get INIT_INVITE_FORM_STATE () {
    return {
      state: 'idle',
      email: {
        value: '',
      },
      role: {
        value: 'DEVELOPER',
      },
    };
  };

  static get INIT_AUTHORISATIONS () {
    return {
      invite: false,
      edit: false,
      delete: false,
    };
  };

  constructor () {
    super();

    /** @type {Authorisations} Sets the authorisations that control the display of the invite form and the edit / remove buttons. */
    this.authorisations = CcOrgaMemberList.INIT_AUTHORISATIONS;

    /** @type {OrgaMemberInviteFormState} Sets the state of the member invite form. */
    this.inviteMemberForm = CcOrgaMemberList.INIT_INVITE_FORM_STATE;

    /** @type {OrgaMemberListState} Sets the state of the member list. */
    this.members = { state: 'loading' };

    new LostFocusController(this, 'cc-orga-member-card', ({ suggestedElement }) => {
      if (suggestedElement == null) {
        this._noResultMessageRef.value?.focus();
      }
      else {
        suggestedElement.focusDeleteBtn();
      }
    });

    this._inviteMemberEmailRef = createRef();
    this._inviteMemberRoleRef = createRef();
    this._noResultMessageRef = createRef();
  }

  _getRoleOptions () {
    return [
      { value: 'ADMIN', label: i18n('cc-orga-member-list.invite.role-admin') },
      { value: 'DEVELOPER', label: i18n('cc-orga-member-list.invite.role-developer') },
      { value: 'ACCOUNTING', label: i18n('cc-orga-member-list.invite.role-accounting') },
      { value: 'MANAGER', label: i18n('cc-orga-member-list.invite.role-manager') },
    ];
  }

  /**
   * @param {OrgaMemberCardState[]} members
   * @param {string|null} identityFilter
   * @param {boolean} mfaDisabledOnlyFilter
   * @return {OrgaMemberCardState[]}
   * @private
   */
  _getFilteredMemberList (members, identityFilter, mfaDisabledOnlyFilter) {
    const filteredMemberList = members.filter((member) => {

      const matchIdentity = identityFilter == null
        || identityFilter === ''
        || member.name?.toLowerCase().includes(identityFilter)
        || member.email.toLowerCase().includes(identityFilter);

      const matchMfaDisabled = !mfaDisabledOnlyFilter || !member.isMfaEnabled;

      return matchIdentity && matchMfaDisabled;
    });

    return filteredMemberList;
  }

  _onSubmit () {

    const existingEmails = this.members.value.map((member) => member.email);
    const email = this._inviteMemberEmailRef.value.value;
    const role = this._inviteMemberRoleRef.value.value;

    const duplicateEmailError = existingEmails.includes(email) ? 'duplicate' : null;
    const emailError = validateEmailAddress(email) ?? duplicateEmailError;

    // We need to re-apply the value retrieved from the DOM via refs to the template (with potential errors)
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

    if (emailError == null) {
      dispatchCustomEvent(this, 'invite', { email, role });
    }
  }

  _onFilterIdentity ({ detail: value }) {
    this.members = {
      ...this.members,
      identityFilter: value?.trim().toLowerCase(),
    };
  }

  _onFilterMfa () {
    this.members = {
      ...this.members,
      mfaDisabledOnlyFilter: !this.members.mfaDisabledOnlyFilter,
    };
  }

  /**
  * @return {OrgaMemberCardState[]} AdminMembers - the list of admins in the organisation. Used to ensure we don't allow deletion of the last admin.
  */
  _getAdminList () {
    return this.members.value.filter((member) => member.role === 'ADMIN');
  }

  /**
   * Triggered when trying to edit or delete a member.
   * Checks whether the member is the last admin of the org.
   * If not, we let the event go through to the smart component.
   * If last admin, we stop the event here, and we set the error message.
   *
   * @param {event} event - the edit / delete event. We stop its propagation if it's related to the last admin.
   */
  _checkIsLastAdmin (event) {
    const adminList = this._getAdminList();
    if (adminList.length === 1 && adminList[0].id === event.detail.memberId) {
      // Prevent event from reaching the smart component
      event.stopPropagation();
      // set 'last-admin' error on the member card
      this.members = {
        ...this.members,
        value: this.members.value.map((member) => {
          return (member.id === event.detail.memberId)
            ? { ...member, error: 'last-admin' }
            : { ...member };
        }),
      };
    }
  }

  /**
   * Everytime we render a new list, remove "last-admin" error if the list contains more than 1 admin.
   */
  resetLastAdminErrors () {
    const adminList = this._getAdminList();
    if (adminList.length > 1) {
      this.members = {
        ...this.members,
        value: this.members.value.map((member) => ({
          ...member,
          error: null,
        })),
      };
    }
  }

  /**
  * Close all other cards.
  * */
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

  render () {
    return html`

      ${this.authorisations.invite ? this._renderInviteForm() : ''}

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
          ${this._renderLoaded(this.members.value, this.members.identityFilter, this.members.mfaDisabledOnlyFilter)}
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
            .options=${this._getRoleOptions()}
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
   * @param {boolean} mfaDisabledOnlyFilter
   * @return {TemplateResult<1>}
   * @private
   */
  _renderLoaded (memberList, identityFilter, mfaDisabledOnlyFilter) {

    // We only display filters if the member list contains at least 2 members
    const containsAtLeast2Members = memberList.length >= 2;
    // We only display the mfa disabled filter if the member list contains at least one member with mfa disabled
    const containsDisabledMfa = memberList.some((member) => !member.isMfaEnabled);
    const filteredMemberList = this._getFilteredMemberList(memberList, identityFilter, mfaDisabledOnlyFilter);
    const isFilteredMemberListEmpty = filteredMemberList.length === 0;

    // Everytime we render a new list, check that "last-admin" errors are still relevant and remove them if not.
    this.resetLastAdminErrors();

    return html`
      ${containsAtLeast2Members ? html`
        <div class="filters">
          <cc-input-text
            label=${i18n('cc-orga-member-list.filter-name')}
            .value=${live(identityFilter)}
            @cc-input-text:input=${this._onFilterIdentity}
          ></cc-input-text>
          ${containsDisabledMfa ? html`
            <label class="filters__mfa" for="filter-mfa">
              <input id="filter-mfa" type="checkbox" @change=${this._onFilterMfa} .checked=${live(mfaDisabledOnlyFilter)}>
              ${i18n('cc-orga-member-list.mfa-label')}
            </label>
          ` : ''}
        </div>
      ` : ''}

      <div class="member-list">
        ${repeat(filteredMemberList, (member) => member.id, (member) => html`
          <cc-orga-member-card
            class=${classMap({ editing: member.state === 'editing' })}
            .authorisations=${{
              edit: this.authorisations.edit,
              delete: this.authorisations.delete,
            }}
            .member=${member}
            @cc-orga-member-card:toggle-editing=${this._onToggleCardEditing}
            @cc-orga-member-card:update=${this._checkIsLastAdmin}
            @cc-orga-member-card:delete=${this._checkIsLastAdmin}
          ></cc-orga-member-card>
        `)}

        ${isFilteredMemberListEmpty ? html`
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
          gap: 1.5em;
        }

        /*region invite form */
        .invite-form {
          align-items: start;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .info {
          font-style: italic;
          margin: 0.5em 0;
        }

        /* 100 is a weird value but this makes the input grow as much as possible 
        without pushing the select to a new line until the input width reaches 18em */
        .invite-form cc-input-text {
          flex: 100 1 18em;
        }

        .invite-form cc-select {
          flex: 1 1 max-content;
        }

        .submit {
          display: flex;
          justify-content: end;
          width: 100%;
        }
        /*endregion */

        /*region member list  */
        .member-count {
          font-size: 0.8em;
          margin-left: 0.2em;
        }

        .member-list {
          display: flex;
          flex-direction: column;
          gap: 2em;
        }

        .filters {
          align-items: end;
          display: flex;
          flex-wrap: wrap;
          gap: 1em 2.5em;
          justify-content: space-between;
          margin-bottom: 1em;
        }

        .filters cc-input-text {
          flex: 1 1 25em;
        }
        
        .filters__mfa {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .filters__mfa input {
          height: 1.2em;
          margin: 0;
          width: 1.2em;
        }

        cc-orga-member-card.editing {
          background-color: var(--cc-color-bg-neutral);
          /* box-shadow is used to make the background spread full width (cancel the parent padding) */
          box-shadow: 0 0 0 1em var(--cc-color-bg-neutral);
        }
        /*endregion */
      `,
    ];
  }
}

window.customElements.define('cc-orga-member-list', CcOrgaMemberList);
