import {
  ADD_ORGANISATION_MEMBER_ERROR_CODES,
  AddOrganisationMemberCommand,
} from '@clevercloud/client/cc-api-commands/organisation/add-organisation-member-command.js';
import { ListOrganisationMemberCommand } from '@clevercloud/client/cc-api-commands/organisation/list-organisation-member-command.js';
import {
  REMOVE_ORGANISATION_MEMBER_ERROR_CODES,
  RemoveOrganisationMemberCommand,
} from '@clevercloud/client/cc-api-commands/organisation/remove-organisation-member-command.js';
import {
  UPDATE_ORGANISATION_MEMBER_ERROR_CODES,
  UpdateOrganisationMemberCommand,
} from '@clevercloud/client/cc-api-commands/organisation/update-organisation-member-command.js';
import { GetProfileCommand } from '@clevercloud/client/cc-api-commands/profile/get-profile-command.js';
import { isCcHttpErrorWithCode, isRateLimitError } from '@clevercloud/client/utils/error-utils.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcOrgaMemberLeftEvent } from './cc-orga-member-list.events.js';
import { CcOrgaMemberList } from './cc-orga-member-list.js';

/**
 * @import { OrgaMemberListStateLoaded } from './cc-orga-member-list.types.js'
 * @import { OrgaMember, OrgaMemberRole, OrgaMemberCardState } from '../cc-orga-member-card/cc-orga-member-card.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-orga-member-list',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcOrgaMemberList>} args
   */
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, ownerId } = context;

    /**
     * Checks if a manager is trying to edit an admin
     *
     * @param {OrgaMemberRole} role - the current role of the member to update
     * @param {Array<OrgaMember>} members - the orga members
     * @return {boolean} - `true` if a manager is trying to edit and admin / `false` otherwise.
     */
    function isManagerEditingAdmin(role, members) {
      if (role !== 'ADMIN') {
        return false;
      }
      const currentUser = members.find((member) => member.isCurrentUser);
      return currentUser.role === 'MANAGER';
    }

    /**
     * @param {OrgaMemberRole} [role] - the current role of the member to update
     */
    function updateAuthorisations(role) {
      const hasAdminRights = role === 'ADMIN' || role === 'MANAGER';

      updateComponent('authorisations', {
        invite: hasAdminRights,
        edit: hasAdminRights,
        delete: hasAdminRights,
      });
    }

    /**
     *
     * @param {string} memberId
     * @param {(orgaMember: OrgaMemberCardState) => void} callback
     */
    function updateMemberState(memberId, callback) {
      updateComponent(
        'memberListState',
        /** @param {OrgaMemberListStateLoaded} memberListState */
        (memberListState) => {
          const memberState = memberListState.memberList.find((member) => member.id === memberId);
          if (memberState != null) {
            callback(memberState);
          }
        },
      );
    }

    onEvent('cc-orga-member-invite', ({ email, role }) => {
      component.inviteMemberFormState = { type: 'inviting' };

      postNewMember({ apiConfig, ownerId, email: email.trim(), role })
        .then(() => {
          notifySuccess(i18n('cc-orga-member-list.invite.submit.success', { userEmail: email }));
          component.resetInviteMemberForm();
        })
        .catch(
          /** @param {Error} error */
          (error) => {
            console.error(error);
            if (
              isCcHttpErrorWithCode(error, ADD_ORGANISATION_MEMBER_ERROR_CODES.UNAUTHORISED_ADDITION) ||
              isCcHttpErrorWithCode(error, ADD_ORGANISATION_MEMBER_ERROR_CODES.UNAUTHORISED_ROLE_ASSIGNMENT)
            ) {
              notifyError(
                i18n('cc-orga-member-list.error.unauthorised.text'),
                i18n('cc-orga-member-list.error.unauthorised.heading'),
              );
            } else if (isRateLimitError(error)) {
              notifyError(
                i18n('cc-orga-member-list.invite.submit.error-rate-limit.message'),
                i18n('cc-orga-member-list.invite.submit.error-rate-limit.title'),
              );
            } else {
              notifyError(i18n('cc-orga-member-list.invite.submit.error', { userEmail: email }));
            }
          },
        )
        .finally(() => {
          component.inviteMemberFormState = { type: 'idle' };
        });
    });

    onEvent('cc-orga-member-update', ({ id, role, newRole, name, email, isCurrentUser }) => {
      if (component.memberListState.type !== 'loaded') {
        return;
      }

      /**
       * The API does not prevent Managers from editing Admins yet.
       * We need to check if a Manager tries to edit an Admin and throw an error if that's the case.
       */
      if (isManagerEditingAdmin(role, component.memberListState.memberList)) {
        notifyError(
          i18n('cc-orga-member-list.error.unauthorised.text'),
          i18n('cc-orga-member-list.error.unauthorised.heading'),
        );
        return;
      }

      updateMemberState(
        id,
        /** @param {OrgaMemberCardState} member */
        (member) => {
          member.type = 'updating';
        },
      );

      editMember({ apiConfig, ownerId, id, newRole })
        .then(() => {
          notifySuccess(i18n('cc-orga-member-list.edit.success', { memberIdentity: name ?? email }));
          updateMemberState(
            id,
            /** @param {OrgaMemberCardState} member */
            (member) => {
              member.type = 'loaded';
              member.role = newRole;
            },
          );

          if (isCurrentUser) {
            updateAuthorisations(newRole);
          }
        })
        .catch(
          /** @param {Error} error */
          (error) => {
            console.error(error);
            if (
              isCcHttpErrorWithCode(error, UPDATE_ORGANISATION_MEMBER_ERROR_CODES.UNAUTHORISED_ADDITION) ||
              isCcHttpErrorWithCode(error, UPDATE_ORGANISATION_MEMBER_ERROR_CODES.UNAUTHORISED_ROLE_ASSIGNMENT)
            ) {
              notifyError(
                i18n('cc-orga-member-list.error.unauthorised.text'),
                i18n('cc-orga-member-list.error.unauthorised.heading'),
              );
            } else if (isCcHttpErrorWithCode(error, UPDATE_ORGANISATION_MEMBER_ERROR_CODES.NOT_FOUND)) {
              notifyError(
                i18n('cc-orga-member-list.error-member-not-found.text'),
                i18n('cc-orga-member-list.error-member-not-found.heading'),
              );
            } else {
              notifyError(i18n('cc-orga-member-list.edit.error', { memberIdentity: name ?? email }));
            }

            updateMemberState(
              id,
              /** @param {OrgaMemberCardState} member */
              (member) => {
                member.type = 'editing';
              },
            );
          },
        );
    });

    onEvent('cc-orga-member-delete', ({ id, name, email }) => {
      updateMemberState(
        id,
        /** @param {OrgaMemberCardState} member */
        (member) => {
          member.type = 'deleting';
        },
      );

      deleteMember({ apiConfig, ownerId, id })
        .then(() => {
          notifySuccess(i18n('cc-orga-member-list.delete.success', { memberIdentity: name ?? email }));
          updateComponent(
            'memberListState',
            /** @param {OrgaMemberListStateLoaded} memberListState */
            (memberListState) => {
              memberListState.memberList = memberListState.memberList.filter((member) => member.id !== id);
            },
          );
        })
        .catch(
          /** @param {Error} error */
          (error) => {
            console.error(error);
            if (isCcHttpErrorWithCode(error, REMOVE_ORGANISATION_MEMBER_ERROR_CODES.UNAUTHORISED_DELETION)) {
              notifyError(
                i18n('cc-orga-member-list.error.unauthorised.text'),
                i18n('cc-orga-member-list.error.unauthorised.heading'),
              );
            } else if (isCcHttpErrorWithCode(error, REMOVE_ORGANISATION_MEMBER_ERROR_CODES.NOT_FOUND)) {
              notifyError(
                i18n('cc-orga-member-list.error-member-not-found.text'),
                i18n('cc-orga-member-list.error-member-not-found.heading'),
              );
            } else {
              notifyError(i18n('cc-orga-member-list.delete.error', { memberIdentity: name ?? email }));
            }

            updateMemberState(
              id,
              /** @param {OrgaMemberCardState} member */
              (member) => {
                member.type = 'loaded';
              },
            );
          },
        );
    });

    onEvent('cc-orga-member-leave', (orgaMember) => {
      updateMemberState(
        orgaMember.id,
        /** @param {OrgaMemberCardState} member */
        (member) => {
          member.type = 'deleting';
        },
      );

      updateComponent(
        'memberListState',
        /** @param {OrgaMemberListStateLoaded} memberListState */
        (memberListState) => {
          memberListState.dangerZoneState = 'leaving';
        },
      );

      deleteMember({ apiConfig, ownerId, id: orgaMember.id })
        .then(() => {
          notifySuccess(i18n('cc-orga-member-list.leave.success'));
          updateAuthorisations();
          updateComponent('memberListState', { type: 'error' });
          component.dispatchEvent(new CcOrgaMemberLeftEvent(orgaMember));
        })
        .catch(
          /** @param {Error} error */
          (error) => {
            console.error(error);
            notifyError(i18n('cc-orga-member-list.leave.error'));
            updateMemberState(
              orgaMember.id,
              /** @param {OrgaMemberCardState} member */
              (member) => {
                member.type = 'loaded';
              },
            );
            updateComponent(
              'memberListState',
              /** @param {OrgaMemberListStateLoaded} memberListState */
              (memberListState) => {
                memberListState.dangerZoneState = 'idle';
              },
            );
          },
        );
    });

    // Reset the component before loading
    updateComponent('authorisations', CcOrgaMemberList.INIT_AUTHORISATIONS);
    component.resetInviteMemberForm();
    component.inviteMemberFormState = { type: 'idle' };
    updateComponent('memberListState', { type: 'loading' });

    getMemberList({ apiConfig, ownerId, signal })
      .then((memberListState) => {
        const currentUser = memberListState.find((member) => member.isCurrentUser);

        updateAuthorisations(currentUser.role);
        updateComponent('memberListState', {
          type: 'loaded',
          memberList: memberListState.map((member) => ({ type: 'loaded', ...member })),
          identityFilter: '',
          mfaDisabledOnlyFilter: false,
          dangerZoneState: 'idle',
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('memberListState', { type: 'error' });
      });
  },
});

/**
 * @param {Object} args
 * @param {ApiConfig} args.apiConfig
 * @param {string} args.ownerId
 * @param {AbortSignal} args.signal
 * @return {Promise<Array<OrgaMember>>}
 */
function getMemberList({ apiConfig, ownerId, signal }) {
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  return Promise.all([
    ccApiClient.send(new GetProfileCommand(), { signal }),
    ccApiClient.send(new ListOrganisationMemberCommand({ organisationId: ownerId }), { signal }),
  ]).then(([profile, memberList]) => {
    return memberList.map((member) => ({
      id: member.id,
      avatar: member.avatar,
      name: member.name,
      jobTitle: member.jobTitle,
      role: /** @type {OrgaMemberRole} */ (member.role),
      email: member.emailAddress,
      isMfaEnabled: member.preferredMFA === 'TOTP',
      isCurrentUser: member.id === profile.id,
    }));
  });
}

/**
 * @param {Object} args
 * @param {ApiConfig} args.apiConfig
 * @param {string} args.ownerId
 * @param {string} args.email
 * @param {OrgaMemberRole} args.role
 * @return {Promise<void>}
 */
function postNewMember({ apiConfig, ownerId, email, role }) {
  return getCcApiClientWithOAuth(apiConfig).send(
    new AddOrganisationMemberCommand({ organisationId: ownerId, emailAddress: email, role }),
  );
}

/**
 * @param {Object} args
 * @param {ApiConfig} args.apiConfig
 * @param {string} args.ownerId
 * @param {string} args.id
 * @return {Promise<void>}
 */
function deleteMember({ apiConfig, ownerId, id }) {
  return getCcApiClientWithOAuth(apiConfig).send(
    new RemoveOrganisationMemberCommand({ organisationId: ownerId, memberId: id }),
  );
}

/**
 * @param {Object} args
 * @param {ApiConfig} args.apiConfig
 * @param {string} args.ownerId
 * @param {string} args.id
 * @param {OrgaMemberRole} args.newRole
 * @return {Promise<void>}
 */
function editMember({ apiConfig, ownerId, id, newRole }) {
  return getCcApiClientWithOAuth(apiConfig).send(
    new UpdateOrganisationMemberCommand({ organisationId: ownerId, memberId: id, role: newRole }),
  );
}
