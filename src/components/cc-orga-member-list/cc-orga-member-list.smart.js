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

defineSmartComponent({
  selector: 'cc-orga-member-list',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
  },
  onContextUpdate ({ component, context, onEvent, updateComponent, signal }) {

    const { apiConfig, ownerId } = context;

    function refreshAuthorisations (role) {
      const hasAdminRights = role === 'ADMIN' || role === 'MANAGER';

      component.authorisations = {
        invite: hasAdminRights,
        edit: hasAdminRights,
        delete: hasAdminRights,
      };
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
          notifySuccess(component, i18n('cc-orga-member-list.invite.submit-success', { userEmail: email }));
          updateComponent('inviteMemberForm', CcOrgaMemberList.INIT_INVITE_FORM_STATE);
        })
        .catch(() => {
          notifyError(component, i18n('cc-orga-member-list.invite.submit-error', { userEmail: email }));
          updateComponent('inviteMemberForm', (inviteMemberForm) => {
            inviteMemberForm.state = 'idle';
          });
        });
    });

    onEvent('cc-orga-member-card:update', ({ memberId, role, memberIdentity, isCurrentUser }) => {

      updateMember(memberId, (member) => {
        member.state = 'updating';
        member.role = role;
      });

      editMember({ apiConfig, ownerId, memberId, role, memberIdentity, isCurrentUser })
        .then(() => {
          notifySuccess(component, i18n('cc-orga-member-list.edit-success', { memberIdentity }));

          updateMember(memberId, (member) => {
            member.state = 'loaded';
            member.role = role;

            if (member.isCurrentUser) {
              refreshAuthorisations(role);
            }
          });
        })
        .catch((error) => {
          if (error.id === 6451) {
            notifyError(component, i18n('cc-orga-member-list.edit-error-unauthorised', { memberIdentity }));
          }
          else {
            console.error(error);
            notifyError(component, i18n('cc-orga-member-list.edit-error', { memberIdentity }));
          }

          updateMember(memberId, (member) => {
            member.state = 'loaded';
          });
        });
    });

    onEvent('cc-orga-member-card:delete', ({ memberId, memberIdentity }) => {

      updateMember(memberId, (member) => {
        member.state = 'deleting';
      });

      deleteMember({ apiConfig, ownerId, memberId })
        .then(() => {
          notifySuccess(component, i18n('cc-orga-member-list.remove-success', { memberIdentity }));
          updateComponent('members', (members) => {
            members.value = members.value.filter((member) => member.id !== memberId);
          });
        })
        .catch(() => {
          notifyError(component, i18n('cc-orga-member-list.remove-error', { memberIdentity }));
          updateMember(memberId, (member) => {
            member.state = 'loaded';
          });
        });
    });

    // Reset the component before loading
    component.authorisations = CcOrgaMemberList.INIT_AUTHORISATIONS;
    updateComponent('inviteMemberForm', CcOrgaMemberList.INIT_INVITE_FORM_STATE);
    updateComponent('members', { state: 'loading' });

    getMemberList({ apiConfig, ownerId, signal })
      .then((memberList) => {
        const currentUser = memberList.find((member) => member.isCurrentUser);

        refreshAuthorisations(currentUser.role);
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
          email: member.email,
          isMfaEnabled: member.preferredMFA === 'TOTP',
          isCurrentUser: member.id === ownerId,
        }))
        .sort((a, b) => {
          // currentUser first, then alphabetical order - case-insensitive
          if (a.id === ownerId) {
            return -1;
          }
          if (b.id === ownerId) {
            return 1;
          }
          return a.email.localeCompare(b.email, { sensitivity: 'base' });
        });
    });
}

function postNewMember ({ apiConfig, ownerId, email, role }) {
  return addMember({ id: ownerId }, { email, role, job: null })
    /* .then(sendToApi({ apiConfig }));*/
    .then(() => fakeApi(true));
}

function deleteMember ({ apiConfig, ownerId, memberId }) {
  return removeMember({ id: ownerId, userId: memberId })
  // .then(sendToApi({ apiConfig }));

    .then(() => fakeApi(true));
}

function editMember ({ apiConfig, ownerId, memberId, role }) {
  return updateMember({ id: ownerId, userId: memberId }, { role })
  // .then(sendToApi({ apiConfig }));

    .then(() => fakeApi(true));
}

const fakeApi = (shouldResolve) => new Promise((resolve, reject) => {
  setTimeout(() => shouldResolve
    ? resolve('response')
    : reject(new Error('Fake error from fake API'))
  , 2000);
});
