import {
  todo_addEmailAddress as addEmailAddress,
  todo_getConfirmationEmail as sendConfirmationEmail,
  todo_getEmailAddresses as getEmailAddresses,
  todo_removeEmailAddress as removeEmailAddress,
} from '@clevercloud/client/esm/api/v2/user.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { i18n } from '../../lib/i18n.js';
import { notify, notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-email-list.js';

/**
 * @typedef {import('./cc-email-list.js').CcEmailList} CcEmailList
 */

defineSmartComponent({
  selector: 'cc-email-list',
  params: {
    apiConfig: { type: Object },
  },
  /**
   *
   * @param {Object} settings
   * @param {CcEmailList} settings.component
   * @param {{apiConfig: Object}} settings.context
   * @param {(type: string, listener: (detail: any) => void) => void} settings.onEvent
   * @param {function} settings.updateComponent
   * @param {AbortSignal} settings.signal
   */
  onContextUpdate ({ component, context, onEvent, updateComponent, signal }) {

    updateComponent('emails', { state: 'loading' });

    const api = getApi(context.apiConfig, signal);

    function updateSecondary (address, callback) {
      updateComponent('emails', (emails) => {
        const secondaryState = emails.value.secondaryAddresses.find((a) => a.address === address);
        if (secondaryState != null) {
          callback(secondaryState);
        }
      });
    }

    api.fetchEmailAddresses()
      .then(({ self, secondary }) => {
        updateComponent('emails', {
          state: 'loaded',
          value: {
            primaryAddress: {
              state: 'idle',
              address: self.email,
              verified: self.emailValidated,
            },
            secondaryAddresses: secondary.map((a) => ({
              state: 'idle',
              address: a,
              verified: true,
            })),
          },
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('emails', { state: 'error' });
      });

    onEvent('cc-email-list:send-confirmation-email', (address) => {

      updateComponent('emails', (emails) => {
        emails.value.primaryAddress.state = 'sending-confirmation-email';
      });

      api.sendConfirmationEmail(address)
        .then(() => {
          notify({
            intent: 'info',
            title: i18n('cc-email-list.primary.action.resend-confirmation-email.success.title'),
            message: i18n('cc-email-list.primary.action.resend-confirmation-email.success.message', { address }),
            options: {
              timeout: 0,
              closeable: true,
            },
          });
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-email-list.primary.action.resend-confirmation-email.error', { address }));
        })
        .finally(() => {
          updateComponent('emails', (emails) => {
            emails.value.primaryAddress.state = 'idle';
          });
        });
    });

    onEvent('cc-email-list:add', async (address) => {
      const addEmailForm = component.getAddEmailForm();

      await addEmailForm.setState('adding');

      api.addSecondaryEmailAddress(address)
        .then(() => {
          notify({
            intent: 'info',
            title: i18n('cc-email-list.secondary.action.add.success.title'),
            message: i18n('cc-email-list.secondary.action.add.success.message', { address }),
            options: {
              timeout: 0,
              closeable: true,
            },
          });

          addEmailForm.reset();
          addEmailForm.setState(null);
        })
        .catch((error) => {
          const transaction = addEmailForm.beginTransaction();

          if (error.id === 550) {
            transaction.addError('address', 'invalid');
          }
          else if (error.id === 101) {
            transaction.addError('address', 'already-defined');
          }
          else if (error.id === 1004) {
            transaction.addError('address', 'used');
          }
          else {
            console.error(error);
            notifyError(i18n('cc-email-list.secondary.action.add.error', { address }));
          }

          transaction.setState(null).commit();
        });

    });

    onEvent('cc-email-list:delete', (address) => {

      updateSecondary(address, (secondaryAddressState) => {
        secondaryAddressState.state = 'deleting';
      });

      api.deleteSecondaryEmailAddress(address)
        .then(() => {
          notifySuccess(i18n('cc-email-list.secondary.action.delete.success', { address }));

          updateComponent('emails', (emails) => {
            emails.value.secondaryAddresses = emails.value.secondaryAddresses.filter((a) => a.address !== address);
          });
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-email-list.secondary.action.delete.error', { address }));
          updateSecondary(address, (secondaryAddressState) => {
            secondaryAddressState.state = 'idle';
          });
        });
    });

    onEvent('cc-email-list:mark-as-primary', (address) => {

      updateSecondary(address, (secondaryAddressState) => {
        secondaryAddressState.state = 'marking-as-primary';
      });

      api.markSecondaryEmailAddressAsPrimary(address)
        .then(() => {
          notifySuccess(i18n('cc-email-list.secondary.action.mark-as-primary.success', { address }));

          const primaryAddress = component.emails.value.primaryAddress.address;

          updateComponent('emails', (emails) => {
            emails.value.primaryAddress.address = address;
          });
          updateSecondary(address, (secondaryAddressState) => {
            secondaryAddressState.state = 'idle';
            secondaryAddressState.address = primaryAddress;
          });
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-email-list.secondary.action.mark-as-primary.error', { address }));
          updateSecondary(address, (secondaryAddressState) => {
            secondaryAddressState.state = 'idle';
          });
        });
    });
  },
});

// -- API calls
function getApi (apiConfig, signal) {
  return {
    fetchEmailAddresses () {
      return Promise.all([
        this.fetchPrimaryEmailAddress(),
        this.fetchSecondaryEmailAddresses(),
      ]).then(([self, secondary]) => {
        return { self, secondary };
      });
    },

    fetchPrimaryEmailAddress () {
      return Promise.resolve({
        method: 'get',
        url: `/v2/self`,
        headers: { Accept: 'application/json' },
      })
        .then(sendToApi({ apiConfig, signal }));
    },

    fetchSecondaryEmailAddresses () {
      return getEmailAddresses()
        .then(sendToApi({ apiConfig, signal }));
    },

    sendConfirmationEmail () {
      return sendConfirmationEmail()
        .then(sendToApi({ apiConfig }));
    },

    addSecondaryEmailAddress (address) {
      return addEmailAddress({ email: address }, {})
        .then(sendToApi({ apiConfig }));
    },

    deleteSecondaryEmailAddress (address) {
      return removeEmailAddress({ email: address })
        .then(sendToApi({ apiConfig }));
    },

    markSecondaryEmailAddressAsPrimary (address) {
      return addEmailAddress({ email: address }, {
        // eslint-disable-next-line camelcase
        make_primary: true,
      })
        .then(sendToApi({ apiConfig }));
    },
  };
}
