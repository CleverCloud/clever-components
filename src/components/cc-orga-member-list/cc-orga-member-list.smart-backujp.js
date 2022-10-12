import './cc-orga-member-list.js';
import '../cc-smart-container/cc-smart-container.js';
import { getAllMembers, addMember, removeMemeber as removeMember, updateMember } from '@clevercloud/client/esm/api/v2/organisation.js';
import { i18n } from '../../lib/i18n.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { fromCustomEvent, LastPromise, unsubscribeWithSignal, withLatestFrom } from '../../lib/observables.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineComponent } from '../../lib/smart-manager.js';

defineComponent({
  selector: 'cc-orga-member-list',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    currentUserId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {
    const memberList_lp = new LastPromise();
    const inviteMember_lp = new LastPromise();
    const removeMember_lp = new LastPromise();
    const editMember_lp = new LastPromise();

    const onInvite$ = fromCustomEvent(component, 'cc-orga-member-list:invite')
      .pipe(withLatestFrom(context$));

    const onDelete$ = fromCustomEvent(component, 'cc-orga-member-card:remove').pipe(
      withLatestFrom(context$),
    );

    const onEdit$ = fromCustomEvent(component, 'cc-orga-member-card:edit').pipe(
      withLatestFrom(context$),
    );

    unsubscribeWithSignal(disconnectSignal, [
      // TODO: deal with too many requests vs other errors
      inviteMember_lp.error$.subscribe(console.error),

      memberList_lp.error$.subscribe((error) => {
        console.error(error);
        component.stateMemberList = 'error';
      }),

      memberList_lp.value$.subscribe((memberList) => {
        component.memberList = memberList;
        component.stateMemberList = 'loaded';
      }),

      removeMember_lp.error$.subscribe(console.error),

      editMember_lp.error$.subscribe(console.error),

      onInvite$.subscribe(([{ email, role }, { apiConfig, ownerId }]) => {
        component.stateMemberInvite = 'waiting';
        // TODO Form control
        // TODO change ownerId to ownerId
        return postNewMember({ apiConfig, ownerId, email, role })
          .then(() => {
            notifySuccess(component, i18n('cc-orga-member-list.invite-submit-success', { userEmail: email }));
            component.resetInviteForm();
          })
          .catch((error) => {
            // TODO issue when 403 + provide specific message
            notifyError(component, i18n('cc-orga-member-list.invite-submit-error', { userEmail: email }));
            console.log(error);
          })
          .finally(() => {
            component.stateMemberInvite = 'loaded';
          });
      }),

      onDelete$.subscribe(([{ memberId, memberIdentity }, { apiConfig, ownerId, currentUserId }]) => {
        updateMemberCard({ component, memberId, property: 'state', value: 'waiting' });

        removeMember_lp.push((signal) => {
          return deleteMember({ apiConfig, ownerId, memberId, memberIdentity, currentUserId, signal })
            .then(() => {
              notifySuccess(component, i18n('cc-orga-member-list.remove-success', { userIdentity: memberIdentity }));
              component.memberList = component.memberList.filter((member) => member.id !== memberId);
            })
            .catch((err) => {
              // TODO issue when trying to remove twice
              console.error(err);
              notifyError(component, i18n('cc-orga-member-list.remove-error', { userIdentity: memberIdentity }));
            })
            .finally(() => {
              updateMemberCard({ component, memberId, property: 'state', value: 'loaded' });
            });
        });
      }),

      /* TODO fix refetch here and use it for delete stuff after */
      onEdit$.subscribe(([{ memberId, role, memberIdentity }, { apiConfig, ownerId, currentUserId }]) => {
        updateMemberCard({ component, memberId, property: 'state', value: 'waiting' });

        editMember_lp.push((signal) => {
          return editMember({ apiConfig, ownerId, currentUserId, memberId, role, memberIdentity, signal })
            .then(() => {
              notifySuccess(component, i18n('cc-orga-member-list.edit-success', { userIdentity: memberIdentity }));
              updateMemberCard({ component, memberId, property: 'role', value: role });
              component.memberInEditing = '';
            })
            .catch(() => notifyError(component, i18n('cc-orga-member-list.edit-error', { userIdentity: memberIdentity })))
            .finally(() => {
              updateMemberCard({ component, memberId, property: 'state', value: 'loaded' });
            });
        });
      }),

      context$.subscribe(({ apiConfig, ownerId, currentUserId }) => {
        if (apiConfig != null && ownerId != null) {
          memberList_lp.push((signal) => fetchMemberList({ apiConfig, ownerId, currentUserId, signal }));
        }
      }),
    ]);
  },

});

function fetchMemberList ({ apiConfig, ownerId, currentUserId, signal }) {
  return getAllMembers({ id: ownerId })
    .then(sendToApi({ apiConfig, signal }))
    .then((memberList) => {
      return memberList.map(({ member, role, job }) => ({
        id: member.id,
        avatar: member.avatar,
        name: member.name,
        jobTitle: job,
        role: role,
        email: member.email,
        mfa: member.preferredMFA === 'TOTP',
        isCurrentUser: member.id === currentUserId,
      }))
        .sort((a, b) => {
          if ((a.id === currentUserId) || (b.id === currentUserId)) {
            return a.id === currentUserId ? -1 : 1;
          }

          return a.email.localeCompare(b.email, { sensitivity: 'base' });
        });
    });
};

function postNewMember ({ apiConfig, ownerId, email, role }) {
  return addMember({ id: ownerId }, { email, role, job: null })
    .then(sendToApi({ apiConfig }));
};

function deleteMember ({ apiConfig, ownerId, memberId, signal }) {
  return removeMember({ id: ownerId, userId: memberId })
    /* .then(sendToApi({ apiConfig, signal })); */
    .then(() => new Promise((resolve, reject) => {
      setTimeout(() => resolve('response'), 2000);
    }));
};

function editMember ({ apiConfig, ownerId, memberId, role, signal }) {
  return updateMember({ id: ownerId, userId: memberId }, { role })
    /* .then(sendToApi({ apiConfig, signal }));*/
    .then(() => new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('NOPE')), 2000);
    }));
};

function updateMemberCard ({ component, memberId, property, value }) {
  component.memberList = component.memberList.map((member) => {
    if (member.id === memberId) {
      member[property] = value;
    }

    return member;
  });
};
