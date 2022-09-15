import './cc-email.js';
import '../cc-smart-container/cc-smart-container.js';
// eslint-disable-next-line camelcase
import { get as getSelf } from '@clevercloud/client/esm/api/v2/organisation.js';
import {
  todo_addEmailAddress as addSecondaryEmailAddress,
  todo_getConfirmationEmail as sendConfirmationEmail,
  todo_getEmailAddresses as getSecondaryEmailAddresses,
} from '@clevercloud/client/esm/api/v2/user.js';
import { produce } from 'immer';
import { CcEventTarget } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { notify, notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineComponent } from '../../lib/smart-manager.js';

defineComponent({
  selector: 'cc-email',
  params: {
    apiConfig: { type: Object },
  },
  onContextUpdate ({ container, component, context, updateSignal }) {

    const target = new CcEventTarget();

    const { apiConfig } = context;
    if (apiConfig == null) {
      return;
    }

    // Reset component
    component.emails = { state: 'loading' };
    component.newEmailForm = {
      state: 'idle',
      address: {
        value: '',
      },
    };

    function updateComponent (component, property, callback) {
      target.dispatch('update-component', { component, property, callback });
    }

    target.on('update-component', ({ component, property, callback }) => {
      component[property] = produce(component[property], callback);
    }, { signal: updateSignal });

    component.addEventListener('cc-email:send-confirmation-email', ({ detail }) => {
      const address = component.emails.primary.address;
      updateComponent(component, 'emails', (draft) => {
        draft.primary.state = 'sending-confirmation';
      });
      doSendConfirmationEmail({ apiConfig, signal: updateSignal })
        .then(() => {
          return notify(component, {
            intent: 'info',
            title: i18n('cc-email.primary.action.resend-confirmation-email.success.title'),
            message: i18n('cc-email.primary.action.resend-confirmation-email.success.message', { address }),
            options: {
              timeout: 0,
              closeable: true,
            },
          });
        })
        .catch(() => notifyError(component, i18n('cc-email.primary.action.resend-confirmation-email.error')))
        .finally(() => {
          updateComponent(component, 'emails', (draft) => {
            draft.primary.state = 'idle';
          });
        });
    }, { signal: updateSignal });

    component.addEventListener('cc-email:mark-as-primary', ({ detail }) => {
      const address = detail;
      updateComponent(component, 'emails', (draft) => {
        const email = draft.secondary.find((e) => e.address === address);
        email.state = 'marking-as-primary';
      });
      doMarkEmailAddressAsPrimary({ apiConfig, signal: updateSignal, address })
        .then(() => {
          notifySuccess(component, i18n('cc-email.secondary.action.mark-as-primary.success'));
          updateComponent(component, 'emails', (draft) => {
            const primaryEmail = draft.primary.address;
            draft.primary.address = address;
            const emailIndex = draft.secondary.findIndex((e) => e.address === address);
            draft.secondary[emailIndex] = {
              state: 'idle',
              address: primaryEmail,
            };
          });
        })
        .catch(() => {
          notifyError(component, i18n('cc-email.secondary.action.mark-as-primary.error'));
          updateComponent(component, 'emails', (draft) => {
            const email = draft.secondary.find((e) => e.address === address);
            email.state = 'idle';
          });
        })
        .finally(() => {
        });
    }, { signal: updateSignal });

    component.addEventListener('cc-email:delete', ({ detail }) => {
      const address = detail;
      updateComponent(component, 'emails', (draft) => {
        const email = draft.secondary.find((e) => e.address === address);
        email.state = 'deleting';
      });
      doDeleteEmailAddress({ apiConfig, signal: updateSignal, address })
        .then(() => {
          notifySuccess(component, i18n('cc-email.secondary.action.delete.success'));
          updateComponent(component, 'emails', (draft) => {
            draft.secondary = draft.secondary.filter((email) => email.address !== address);
          });
        })
        .catch(() => {
          notifyError(component, i18n('cc-email.secondary.action.delete.error'));
          updateComponent(component, 'emails', (draft) => {
            const email = draft.secondary.find((e) => e.address === address);
            email.state = 'idle';
          });
        })
        .finally(() => {
        });
    }, { signal: updateSignal });

    component.addEventListener('cc-email:add', ({ detail }) => {
      updateComponent(component, 'newEmailForm', (draft) => {
        draft.state = 'adding';
      });
      const address = detail;
      doAddSecondaryEmailAddress({ apiConfig, signal: updateSignal, address })
        .then(() => {
          notify(component, {
            intent: 'info',
            title: i18n('cc-email.secondary.action.add.success.title'),
            message: i18n('cc-email.secondary.action.add.success.message', { address }),
            options: {
              timeout: 0,
              closeable: true,
            },
          });
          updateComponent(component, 'newEmailForm', (draft) => {
            draft.state = 'idle';
            draft.address.value = '';
            draft.address.error = null;
          });
        })
        .catch((error) => {
          // Should we toast if we also display an inlined error message?
          notifyError(component, i18n('cc-email.secondary.action.add.error'));

          let formError;
          if (error.id === 101) {
            formError = 'already-defined';
          }
          else if (error.id === 550) {
            formError = 'invalid';
          }
          else if (error.id === 1004) {
            formError = 'used';
          }
          else {
            // maybe we should only toast here
            // If the error is null, we should roll it back to null
          }

          updateComponent(component, 'newEmailForm', (draft) => {
            draft.state = 'idle';
            draft.address.error = formError;
          });
        });
    }, { signal: updateSignal });

    fetchEmailAddresses({ apiConfig, signal: updateSignal })
      .then(({ primary, secondary }) => {
        updateComponent(component, 'emails', (draft) => {
          draft.state = 'loaded';
          draft.primary = { state: 'idle', ...primary };
          draft.secondary = secondary.map((address) => ({ state: 'idle', address }));
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent(component, 'emails', (draft) => {
          draft.state = 'error-loading';
        });
      });

  },
});

function sleep (delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function fetchEmailAddresses ({ apiConfig, signal }) {
  await sleep(2000);
  return {
    primary: {
      address: 'primary@example.com',
      // verified: true,
      verified: false,
    },
    secondary: ['secondary@example.com', 'other-secondary@example.com'],
  };
  return Promise
    .all([
      getSelf({}).then(sendToApi({ apiConfig, signal })),
      getSecondaryEmailAddresses().then(sendToApi({ apiConfig, signal })),
    ])
    .then(([self, secondary]) => {
      return {
        primary: {
          address: self.email,
          verified: self.emailValidated,
        },
        secondary,
      };
    });
}

async function doSendConfirmationEmail ({ apiConfig, signal }) {
  await sleep(2000);
  return;
  return sendConfirmationEmail().then(sendToApi({ apiConfig, signal }));
}

async function doAddSecondaryEmailAddress ({ apiConfig, signal, address }) {
  await sleep(2000);
  return;
  return addSecondaryEmailAddress({ email: address }, {}).then(sendToApi({ apiConfig }));
}

async function doMarkEmailAddressAsPrimary ({ apiConfig, signal, address }) {
  await sleep(2000);
  return;
}

async function doDeleteEmailAddress ({ apiConfig, signal, address }) {
  await sleep(2000);
  return;
}
