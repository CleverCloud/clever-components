import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { validateEmailAddress } from '../../lib/email.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import '../cc-block/cc-block.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-orga-member-card/cc-orga-member-card.js';
import '../cc-notice/cc-notice.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import '../cc-button/cc-button.js';
import '../cc-badge/cc-badge.js';
import '../cc-select/cc-select.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';

/**
 * @typedef {import('./cc-orga-member-list.types.js').OrgaMemberInviteFormState} OrgaMemberInviteFormState
 * @typedef {import('./cc-orga-member-list.types.js').OrgaMemberListState} OrgaMemberListState
 * @typedef {import('./cc-orga-member-list.types.js').Authorisations} Authorisations
 */

/**
 * A component showing the list of members belonging to a given organisation.
 *
 * The list can be filtered by name or email.
 * One can also choose to only show users with Two-Factor Auth (2FA) disabled.
 *
 * Depending on the current user authorisations:
 *
 *  - The current user may remove members,
 *  - The current user may edit the role of members.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<InviteMember>} cc-orga-member-list:invite - Fires the `email` and `role` information inside an object whenever the invite button is clicked.
 * @event {CustomEvent<OrgaMemberCardState>} cc-orga-member-list:leave - Fires when the user clicks on the leave button inside the Danger Zone or inside their own member card.
 * @event {CustomEvent<OrgaMemberCardState>} cc-orga-member-list:update - Fires when the user validates the editing of a member within a member card, only if the update is not related to the last admin of the org.
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

    /** @type {Authorisations} Sets the authorisations that control the display of the invite form and the edit / delete buttons. */
    this.authorisations = CcOrgaMemberList.INIT_AUTHORISATIONS;

    /** @type {OrgaMemberInviteFormState} Sets the state of the member invite form. */
    this.inviteMemberForm = CcOrgaMemberList.INIT_INVITE_FORM_STATE;

    /** @type {OrgaMemberListState} Sets the state of the member list. */
    this.members = { state: 'loading' };

    this._inviteMemberEmailRef = createRef();
    this._inviteMemberRoleRef = createRef();
    this._memberListHeadingRef = createRef();
    this._noResultMessageRef = createRef();

    new LostFocusController(this, 'cc-orga-member-card', ({ suggestedElement }) => {
      if (suggestedElement == null && this._noResultMessageRef.value != null) {
        this._noResultMessageRef.value.focus();
      }
      else if (suggestedElement == null) {
        this._memberListHeadingRef.value.focus();
      }
      else {
        suggestedElement.focusDeleteBtn();
      }
    });
  }

  /**
   * Check if the given member is the last admin of the organisation.
   *
   * @param {OrgaMemberState} member - the member to check
   * @return {boolean} - true if the given member is an admin and there is only one admin left in the organisation
   */
  isLastAdmin (member) {
    const isMemberAdmin = member.role === 'ADMIN';
    const adminList = this._getAdminList();
    const orgContainsOnlyOneAdmin = adminList.length === 1;

    return orgContainsOnlyOneAdmin && isMemberAdmin;
  }

  /**
   * @return {OrgaMemberCardState[]} AdminMembers - the list of admins in the organisation. Used to ensure we don't allow deletion of the last admin.
   */
  _getAdminList () {
    return this.members.value.filter((member) => member.role === 'ADMIN');
  }

  _getRoleOptions () {
    return [
      { value: 'ADMIN', label: i18n('cc-orga-member-list.invite.role.admin') },
      { value: 'DEVELOPER', label: i18n('cc-orga-member-list.invite.role.developer') },
      { value: 'ACCOUNTING', label: i18n('cc-orga-member-list.invite.role.accounting') },
      { value: 'MANAGER', label: i18n('cc-orga-member-list.invite.role.manager') },
    ];
  }

  /**
   * Everytime a new list is rendered, this method is called to:
   * - sort the list (current user first, then by member email in alphabetical order),
   * - filter the list based on what the user has entered inside the identity and mfa filters.
   *
   * @param {OrgaMemberCardState[]} members
   * @param {string} identityFilter
   * @param {boolean} mfaDisabledOnlyFilter
   * @return {OrgaMemberCardState[]}
   * @private
   */
  _getSortedFilteredMemberList (members, identityFilter, mfaDisabledOnlyFilter) {
    const cleanedIdentityFilter = identityFilter?.trim().toLowerCase();

    const filteredMemberList = members.filter((member) => {
      const matchIdentity = cleanedIdentityFilter === ''
        || member.name?.toLowerCase().includes(cleanedIdentityFilter)
        || member.email.toLowerCase().includes(cleanedIdentityFilter);

      const matchMfaDisabled = !mfaDisabledOnlyFilter || !member.isMfaEnabled;

      return matchIdentity && matchMfaDisabled;
    });

    const sortedFilteredMemberList = filteredMemberList.sort((a, b) => {
      // currentUser first, then alphabetical order - case-insensitive
      if (a.isCurrentUser) {
        return -1;
      }
      if (b.isCurrentUser) {
        return 1;
      }
      return a.email.localeCompare(b.email, { sensitivity: 'base' });
    });

    return sortedFilteredMemberList;
  }

  _onEmailInput ({ detail: value }) {
    this.inviteMemberForm = {
      ...this.inviteMemberForm,
      email: {
        ...this.inviteMemberForm.email,
        value: value,
      },
    };
  }

  /**
   * This modifies the `members` prop, triggering a new render.
   * Everytime there is a new render, the list is filtered based on the filter values from the `member` prop.
   *
   * @param {Event}
   * @private
   */
  _onFilterIdentity ({ detail: value }) {
    this.members = {
      ...this.members,
      identityFilter: value,
    };
  }

  /**
   * This modifies the `members` prop, triggering a new render.
   * Everytime there is a new render, the list is filtered based on the filter values from the `member` prop.
   *
   * @private
   */
  _onFilterMfaDisabledOnly () {
    this.members = {
      ...this.members,
      mfaDisabledOnlyFilter: !this.members.mfaDisabledOnlyFilter,
    };
  }

  _onInviteMember () {
    const existingEmails = this.members.value.map((member) => member.email);
    const email = this.inviteMemberForm.email.value.trim();
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
    else {
      this._inviteMemberEmailRef.value.focus();
    }
  }

  _onLeaveFromCard ({ detail: currentUser }) {
    const isLastAdminLeaving = this.isLastAdmin(currentUser);

    if (isLastAdminLeaving) {
      this.members = {
        ...this.members,
        value: this.members.value.map((member) => {
          return (member.id === currentUser.id)
            ? { ...member, error: true }
            : { ...member };
        }),
      };
    }
    else {
      dispatchCustomEvent(this, 'leave', currentUser);
    }
  }

  _onLeaveFromDangerZone () {
    const currentUser = this.members.value.find((member) => member.isCurrentUser);
    const isLastAdminLeaving = this.isLastAdmin(currentUser);

    if (isLastAdminLeaving) {
      this.members = {
        ...this.members,
        dangerZoneState: 'error',
      };
    }
    else {
      dispatchCustomEvent(this, 'leave', currentUser);
    }
  }

  _onRoleInput ({ detail: value }) {
    this.inviteMemberForm = {
      ...this.inviteMemberForm,
      role: {
        ...this.inviteMemberForm.role,
        value: value,
      },
    };
  }

  _onUpdateFromCard ({ detail: memberToUpdate }) {
    const isLastAdmin = memberToUpdate.isCurrentUser && this.isLastAdmin(memberToUpdate);

    if (isLastAdmin) {
      this.members = {
        ...this.members,
        value: this.members.value.map((member) => {
          return (member.id === memberToUpdate.id)
            ? { ...member, error: true }
            : { ...member };
        }),
      };
    }
    else {
      dispatchCustomEvent(this, 'update', memberToUpdate);
    }
  }

  /**
   * Close all cards and leave the one that fired the event
   *
   * @param {Event}
   * @private
   */
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

  /* Everytime we render a new list, remove the "last-admin" error if the list contains more than 1 admin. */
  willUpdate (changedProperties) {
    const memberListNotLoaded = this.members.state !== 'loaded';
    const updateNotRelatedToMembers = !changedProperties.has('members');

    if (updateNotRelatedToMembers || memberListNotLoaded) {
      return;
    }

    const adminList = this._getAdminList();
    const dangerZoneHasError = this.members.dangerZoneState === 'error';

    if (adminList.length > 1) {
      this.members = {
        ...this.members,
        value: this.members.value.map((member) => ({
          ...member,
          error: false,
        })),
      };
    }

    if (adminList.length > 1 && dangerZoneHasError) {
      this.members = {
        ...this.members,
        dangerZoneState: 'idle',
      };
    }
  }

  render () {

    return html`

      <cc-block>
        <div slot="title">${i18n('cc-orga-member-list.main-heading')}</div>
        
        ${this.authorisations.invite ? this._renderInviteForm() : ''}
        
        <cc-block-section>
          <div slot="title" ${ref(this._memberListHeadingRef)} tabindex="-1">
            ${i18n('cc-orga-member-list.list.heading')}
            ${this.members.state === 'loaded' ? html`
              <cc-badge class="member-count" weight="dimmed" intent="neutral" circle>${this.members.value.length}</cc-badge>
            ` : ''}
          </div>
  
          ${this.members.state === 'loading' ? html`
            <cc-loader></cc-loader>
          ` : ''}
  
          ${this.members.state === 'loaded' ? this._renderMemberList(this.members.value, this.members.identityFilter, this.members.mfaDisabledOnlyFilter) : ''}
  
          ${this.members.state === 'error' ? html`
            <cc-notice intent="warning" message="${i18n('cc-orga-member-list.error')}"></cc-notice>
          ` : ''}
        </cc-block-section>
        
        ${this.members.state === 'loaded' ? this._renderDangerZone() : ''}
      </cc-block>
    `;
  }

  _renderInviteForm () {

    const isFormDisabled = this.inviteMemberForm.state === 'inviting';

    return html`
      <cc-block-section>
        <div slot="title">${i18n('cc-orga-member-list.invite.heading')}</div>
        <p class="info">${i18n('cc-orga-member-list.invite.info')}</p>
        
        <form class="invite-form">
          <cc-input-text
            label=${i18n('cc-orga-member-list.invite.email.label')}
            .value=${this.inviteMemberForm.email.value}
            required
            ?disabled=${isFormDisabled}
            @cc-input-text:requestimplicitsubmit=${this._onInviteMember}
            @cc-input-text:input=${this._onEmailInput}
            ${ref(this._inviteMemberEmailRef)}
          >
            <p slot="help">${i18n('cc-orga-member-list.invite.email.format')}</p>
            ${this._renderFormEmailError()}
          </cc-input-text>

          <cc-select
            label=${i18n('cc-orga-member-list.invite.role.label')}
            .options=${this._getRoleOptions()}
            .value=${this.inviteMemberForm.role.value}
            required
            ?disabled=${isFormDisabled}
            @cc-select:input=${this._onRoleInput}
            ${ref(this._inviteMemberRoleRef)}
          >
          </cc-select>

          <div class="submit">
            <cc-button primary ?waiting=${isFormDisabled} @cc-button:click=${this._onInviteMember}>
              ${i18n('cc-orga-member-list.invite.submit')}
            </cc-button>
          </div>
        </form>
      </cc-block-section>
    `;
  }

  _renderFormEmailError () {
    switch (this.inviteMemberForm.email.error) {
      case 'empty':
        return html`<p slot="error">${i18n('cc-orga-member-list.invite.email.error-empty')}</p>`;
      case 'invalid':
        return html`<p slot="error">${i18n('cc-orga-member-list.invite.email.error-format')}</p>`;
      case 'duplicate':
        return html`<p slot="error">${i18n('cc-orga-member-list.invite.email.error-duplicate')}</p>`;
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
  _renderMemberList (memberList, identityFilter, mfaDisabledOnlyFilter) {

    const filteredMemberList = this._getSortedFilteredMemberList(memberList, identityFilter, mfaDisabledOnlyFilter);
    const isFilteredMemberListEmpty = filteredMemberList.length === 0;

    return html`
      <div class="filters">
        <cc-input-text
          label=${i18n('cc-orga-member-list.filter.name')}
          .value=${identityFilter}
          @cc-input-text:input=${this._onFilterIdentity}
        ></cc-input-text>
        <label class="filters__mfa" for="filter-mfa">
          <input id="filter-mfa" type="checkbox" @change=${this._onFilterMfaDisabledOnly} .checked=${mfaDisabledOnlyFilter}>
          ${i18n('cc-orga-member-list.filter.mfa')}
        </label>
      </div>

      <div class="member-list">
        ${repeat(filteredMemberList, (member) => member.id, (member) => html`
          <cc-orga-member-card
            class=${classMap({ editing: member.state === 'editing' })}
            .authorisations=${{
              edit: this.authorisations.edit,
              delete: this.authorisations.delete,
            }}
            .member=${member}
            @cc-orga-member-card:leave=${this._onLeaveFromCard}
            @cc-orga-member-card:toggle-editing=${this._onToggleCardEditing}
            @cc-orga-member-card:update=${this._onUpdateFromCard}
          ></cc-orga-member-card>
        `)}

        ${isFilteredMemberListEmpty ? html`
          <p class="no-result-error" ${ref(this._noResultMessageRef)} tabindex="-1">
            ${i18n('cc-orga-member-list.no-result')}
          </p>
        ` : ''}
      </div>
    `;
  }

  _renderDangerZone () {
    return html`
      <cc-block-section>
        <div slot="title" class="danger">${i18n('cc-orga-member-list.leave.heading')}</div>
        <div class="leave">
          <p class="leave__text">
            ${i18n('cc-orga-member-list.leave.text')}
          </p>
          <cc-button
              danger
              outlined
              @cc-button:click=${this._onLeaveFromDangerZone}
              ?disabled="${this.members.dangerZoneState === 'error'}"
              ?waiting="${this.members.dangerZoneState === 'leaving'}"
          >${i18n('cc-orga-member-list.leave.btn')}</cc-button>
        </div>
        <!-- a11y: we need the live region to be present within the DOM from the start and insert content dynamically inside it. -->
        <div class="wrapper-leave-error" aria-live="polite" aria-atomic="true">
          ${this.members.dangerZoneState === 'error' ? html`
            <div>
                <cc-notice
                  intent="danger"
                  heading="${i18n('cc-orga-member-list.leave.error-last-admin.heading')}"
                  message="${i18n('cc-orga-member-list.leave.error-last-admin.text')}"
                  no-icon
                ></cc-notice>
            </div>
          ` : ''}
        </div>
      </cc-block-section>
    `;
  }

  static get styles () {
    return [
      linkStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        /* region invite form */

        .invite-form {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          gap: 1em 1.5em;
        }

        .info {
          margin: 0.5em 0;
          font-style: italic;
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
          width: 100%;
          justify-content: flex-end;
        }
        /* endregion */

        /* region member list  */

        .member-count {
          margin-left: 0.2em;
          font-size: 0.9em;
        }

        .member-list {
          display: flex;
          flex-direction: column;
          gap: 1.5em;
        }

        .filters {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1em;
          gap: 1em 2.5em;
        }

        .filters cc-input-text {
          flex: 0 1 25em;
        }
        
        .filters__mfa {
          display: flex;
          align-items: center;
          gap: 0.35em;
        }

        .filters__mfa input {
          width: 1.1em;
          height: 1.1em;
          margin: 0;
        }
        
        .no-result-error {
          font-style: italic;
        }

        cc-orga-member-card.editing {
          background-color: var(--cc-color-bg-neutral);
          /* box-shadow is used to make the background spread full width (cancel the parent padding) */
          box-shadow: 0 0 0 1em var(--cc-color-bg-neutral);
        }
        /* endregion */
        
        /* region leave section */

        .leave {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1.5em;
        }

        .leave p {
          margin: 0;
        }
        
        .leave__text {
          display: flex;
          flex: 1 1 21em;
          flex-direction: column;
          gap: 0.5em;
        }
        
        .leave cc-button {
          margin-left: auto;
        }

        .wrapper-leave-error {
          display: flex;
          justify-content: end;
        }
        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-orga-member-list', CcOrgaMemberList);
