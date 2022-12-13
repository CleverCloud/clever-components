import '../cc-smart-container/cc-smart-container.js';
import {
  addMember,
  getAllMembers,
  removeMemeber as removeMember,
  updateMember,
} from '@clevercloud/client/esm/api/v2/organisation.js';
import { getId } from '@clevercloud/client/esm/api/v2/user.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { i18n } from '../../lib/i18n.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { CcOrgaMemberList } from './cc-orga-member-list.js';

const MEMBER_NOT_FOUND = 6501;
const RATE_LIMIT_EXCEEDED = 'You have performed that request too much.';
const UNAUTHORISED_ADMIN_ADDITION = 6451;
const UNAUTHORISED_ADMIN_DELETION = 6452;

defineSmartComponent({
  selector: 'cc-orga-member-list',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
  },
  onContextUpdate ({ component, context, onEvent, updateComponent, signal }) {

    const { apiConfig, ownerId } = context;

    /**
     * Checks if a manager is trying to edit an admin
     *
     * @param {OrgaMemberRole} role - the current role of the member to update
     * @return {boolean} - `true` if a manager is trying to edit and admin / `false` otherwise.
     */
    function isManagerEditingAdmin (role) {
      if (role !== 'ADMIN') {
        return false;
      }
      const currentUser = component.members.value.find((member) => member.isCurrentUser);
      return currentUser.role === 'MANAGER';
    }

    function updateAuthorisations (role) {
      const hasAdminRights = role === 'ADMIN' || role === 'MANAGER';

      updateComponent('authorisations', {
        invite: hasAdminRights,
        edit: hasAdminRights,
        delete: hasAdminRights,
      });
    }

    function updateMember (memberId, callback) {
      updateComponent('members', (members) => {
        const member = members.value.find((member) => member.id === memberId);
        if (member != null) {
          callback(member);
        }
      });
    }

    onEvent('cc-orga-member-list:invite', ({ email, role }) => {

      updateComponent('inviteMemberForm', (inviteMemberForm) => {
        // Note: the UI component already resets the errors and sets the field values
        inviteMemberForm.state = 'inviting';
      });

      postNewMember({ apiConfig, ownerId, email, role })
        .then(() => {
          notifySuccess(i18n('cc-orga-member-list.invite.submit.success', { userEmail: email }));
          updateComponent('inviteMemberForm', CcOrgaMemberList.INIT_INVITE_FORM_STATE);
        })
        .catch((error) => {
          console.error(error);
          if (error.id === UNAUTHORISED_ADMIN_ADDITION) {
            notifyError(i18n('cc-orga-member-list.error.unauthorised.text'), i18n('cc-orga-member-list.error.unauthorised.heading'));
          }
          else if (error.message === RATE_LIMIT_EXCEEDED) {
            notifyError(i18n('cc-orga-member-list.invite.submit.error-rate-limit.message'), i18n('cc-orga-member-list.invite.submit.error-rate-limit.title'));
          }
          else {
            notifyError(i18n('cc-orga-member-list.invite.submit.error', { userEmail: email }));
          }

          updateComponent('inviteMemberForm', (inviteMemberForm) => {
            inviteMemberForm.state = 'idle';
          });
        });
    });

    onEvent('cc-orga-member-list:update', ({ id, role, newRole, name, email, isCurrentUser }) => {

      /**
       * The API does not prevent Managers from editing Admins yet.
       * We need to check if a Manager tries to edit an Admin and throw an error if that's the case.
       */
      if (isManagerEditingAdmin(role)) {
        notifyError(i18n('cc-orga-member-list.error.unauthorised.text'), i18n('cc-orga-member-list.error.unauthorised.heading'));
        return;
      }

      updateMember(id, (member) => {
        member.state = 'updating';
      });

      editMember({ apiConfig, ownerId, id, newRole, name, email, isCurrentUser })
        .then(() => {
          notifySuccess(i18n('cc-orga-member-list.edit.success', { memberIdentity: name ?? email }));
          updateMember(id, (member) => {
            member.state = 'loaded';
            member.role = newRole;
          });

          if (isCurrentUser) {
            updateAuthorisations(newRole);
          }
        })
        .catch((error) => {
          console.error(error);
          if (error.id === UNAUTHORISED_ADMIN_ADDITION || error.id === UNAUTHORISED_ADMIN_DELETION) {
            notifyError(i18n('cc-orga-member-list.error.unauthorised.text'), i18n('cc-orga-member-list.error.unauthorised.heading'));
          }
          else if (error.id === MEMBER_NOT_FOUND) {
            notifyError(i18n('cc-orga-member-list.error-member-not-found.text'), i18n('cc-orga-member-list.error-member-not-found.heading'));
          }
          else {
            notifyError(i18n('cc-orga-member-list.edit.error', { memberIdentity: name ?? email }));
          }

          updateMember(id, (member) => {
            member.state = 'editing';
          });
        });
    });

    onEvent('cc-orga-member-card:delete', ({ id, name, email }) => {
      updateMember(id, (member) => {
        member.state = 'deleting';
      });

      deleteMember({ apiConfig, ownerId, id })
        .then(() => {
          notifySuccess(i18n('cc-orga-member-list.delete.success', { memberIdentity: name ?? email }));
          updateComponent('members', (members) => {
            members.value = members.value.filter((member) => member.id !== id);
          });
        })
        .catch((error) => {
          console.error(error);
          if (error.id === UNAUTHORISED_ADMIN_DELETION) {
            notifyError(i18n('cc-orga-member-list.error.unauthorised.text'), i18n('cc-orga-member-list.error.unauthorised.heading'));
          }
          else if (error.id === MEMBER_NOT_FOUND) {
            notifyError(i18n('cc-orga-member-list.error-member-not-found.text'), i18n('cc-orga-member-list.error-member-not-found.heading'));
          }
          else {
            notifyError(i18n('cc-orga-member-list.delete.error', { memberIdentity: name ?? email }));
          }

          updateMember(id, (member) => {
            member.state = 'loaded';
          });
        });
    });

    onEvent('cc-orga-member-list:leave', ({ id }) => {
      updateMember(id, (member) => {
        member.state = 'deleting';
      });

      updateComponent('members', (members) => {
        members.dangerZoneState = 'leaving';
      });

      deleteMember({ apiConfig, ownerId, id })
        .then(() => {
          notifySuccess(i18n('cc-orga-member-list.leave.success'));
          updateAuthorisations();
          updateComponent('members', { state: 'error' });
          window.dispatchEvent(new Event('orga-member-leave-success'));
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-orga-member-list.leave.error'));
          updateMember(id, (member) => {
            member.state = 'loaded';
          });
          updateComponent('members', (members) => {
            members.dangerZoneState = 'idle';
          });
        });
    });

    // Reset the component before loading
    updateComponent('authorisations', CcOrgaMemberList.INIT_AUTHORISATIONS);
    updateComponent('inviteMemberForm', CcOrgaMemberList.INIT_INVITE_FORM_STATE);
    updateComponent('members', { state: 'loading' });

    getMemberList({ apiConfig, ownerId, signal })
      .then((memberList) => {
        const currentUser = memberList.find((member) => member.isCurrentUser);

        updateAuthorisations(currentUser.role);
        updateComponent('members', {
          state: 'loaded',
          value: memberList.map((member) => ({ state: 'loaded', ...member })),
          identityFilter: '',
          mfaDisabledOnlyFilter: false,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('members', { state: 'error' });
      });
  },
});

function getMemberList ({ apiConfig, ownerId, signal }) {
  return Promise
    .all([
      getId().then(sendToApi({ apiConfig, signal })),
      getAllMembers({ id: ownerId }).then(sendToApi({ apiConfig, signal })),
    ])
    .then(([{ ownerId }, memberList]) => {
      return memberList
        .map(({ member, role, job }) => ({
          id: member.id,
          avatar: member.avatar,
          name: member.name,
          jobTitle: job,
          role: role,
          newRole: role,
          email: member.email,
          isMfaEnabled: member.preferredMFA === 'TOTP',
          isCurrentUser: member.id === ownerId,
        }));
    });
}

function postNewMember ({ apiConfig, ownerId, email, role }) {
  return addMember({ id: ownerId }, { email, role, job: null })
    .then(sendToApi({ apiConfig }));
}

function deleteMember ({ apiConfig, ownerId, id }) {
  return removeMember({ id: ownerId, userId: id })
    .then(sendToApi({ apiConfig }));
}

function editMember ({ apiConfig, ownerId, id, newRole }) {
  return updateMember({ id: ownerId, userId: id }, { role: newRole })
    .then(sendToApi({ apiConfig }));
}
