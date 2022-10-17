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

    function updateMember (memberId, callback) {
      updateComponent('members', (members) => {
        const member = members.value.find((member) => member.id === memberId);
        if (member != null) {
          callback(member);
        }
      });
    }

    function getAdminList () {
      return component.members.value.filter((m) => m.role === 'ADMIN');
    }

    onEvent('cc-orga-member-list:invite', ({ email, role }) => {

      updateComponent('inviteMemberForm', (inviteMemberForm) => {
        // Note: the UI component already resets the errors and sets the field values
        inviteMemberForm.state = 'inviting';
      });

      postNewMember({ apiConfig, ownerId, email, role })
        .then(() => {
          notifySuccess(component, i18n('cc-orga-member-list.invite.submit-success', { userEmail: email }));
          updateComponent('inviteMemberForm', CcOrgaMemberList.INVITE_FORM_INIT_STATE);
        })
        .catch(() => {
          notifyError(component, i18n('cc-orga-member-list.invite.submit-error', { userEmail: email }));
          updateComponent('inviteMemberForm', (inviteMemberForm) => {
            inviteMemberForm.state = 'idle';
          });
        });
    });

    onEvent('cc-orga-member-card:update', ({ memberId, role, memberIdentity }) => {

      // TODO: I guess we should check for last admin stuffs here
      // We still need to decide when to remove this 'last-admin' error
      const adminList = getAdminList();
      if (adminList.length === 1 && adminList[0].id === memberId && role !== 'ADMIN') {
        updateMember(memberId, (member) => {
          member.error = 'last-admin';
        });
        return;
      }

      updateMember(memberId, (member) => {
        member.state = 'updating';
        // TODO: we need to discuss this
        member.role = role;
      });

      editMember({ apiConfig, ownerId, memberId, role, memberIdentity })
        .then(() => {
          notifySuccess(component, i18n('cc-orga-member-list.edit-success', { memberIdentity }));
          updateMember(memberId, (member) => {
            member.state = 'loaded';
            member.role = role;
          });

          /* TODO: discuss the error reset. Shouldn't null be part of the data model ? */
          const adminList = getAdminList();
          if (adminList.length > 1) {
            console.log('SET NEW ADMIN');
            updateComponent('members', (members) => {
              members.value.forEach((member) => {
                member.error = null;
              });
            });
          }
        })
        .catch(() => {
          notifyError(component, i18n('cc-orga-member-list.edit-error', { memberIdentity }));
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
    updateComponent('inviteMemberForm', CcOrgaMemberList.INVITE_FORM_INIT_STATE);
    updateComponent('members', { state: 'loading' });

    getMemberList({ apiConfig, ownerId, signal })
      .then((memberList) => {
        updateComponent('members', {
          state: 'loaded',
          value: memberList.map((member) => ({ state: 'loaded', ...member })),
          identityFilter: '',
          mfaFilter: false,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('members', { state: 'error' });
      });
  },
});

// -----------------------------------------------------------------------------------

function getMemberList ({ apiConfig, ownerId, signal }) {
  return Promise
    .all([
      getId().then(sendToApi({ apiConfig, signal })),
      getAllMembers({ id: ownerId }).then(sendToApi({ apiConfig, signal })),
    ])
    .then(([userId, memberList]) => {
      return memberList
        .map(({ member, role, job }) => ({
          // TODO cleanup empty string stuffs
          id: member.id,
          avatar: member.avatar,
          name: member.name,
          jobTitle: job,
          role: role,
          email: member.email,
          isMfaEnabled: member.preferredMFA === 'TOTP',
          isCurrentUser: member.id === userId,
        }))
        .sort((a, b) => {
          if (a.id === userId) {
            return -1;
          }
          if (b.id === userId) {
            return 1;
          }
          return a.email.localeCompare(b.email, { sensitivity: 'base' });
        });
    });
}

function postNewMember ({ apiConfig, ownerId, email, role }) {
  return addMember({ id: ownerId }, { email, role, job: null })
    /* .then(sendToApi({ apiConfig }));*/
    .then(() => new Promise((resolve, reject) => {
      setTimeout(() => resolve('response'), 2000);
      /* setTimeout(() => reject(new Error('toto')), 2000);*/
    }));
}

function deleteMember ({ apiConfig, ownerId, memberId }) {
  return removeMember({ id: ownerId, userId: memberId })
    /* .then(sendToApi({ apiConfig })); */
    .then(() => new Promise((resolve, reject) => {
      setTimeout(() => resolve('response'), 200);
      // setTimeout(() => reject(new Error('NOPE')), 2000);
    }));
}

function editMember ({ apiConfig, ownerId, memberId, role }) {
  return updateMember({ id: ownerId, userId: memberId }, { role })
    /* .then(sendToApi({ apiConfig }));*/
    .then(() => new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 2000);
      // setTimeout(() => reject(new Error('NOPE')), 2000);
    }));
}
