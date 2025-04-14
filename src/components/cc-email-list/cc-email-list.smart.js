// prettier-ignore
// @ts-expect-error FIXME: remove when clever-client exports types
import { todo_addEmailAddress as addEmailAddress,todo_getEmailAddresses as getEmailAddresses,todo_removeEmailAddress as removeEmailAddress,todo_getConfirmationEmail as sendConfirmationEmail,} from '@clevercloud/client/esm/api/v2/user.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getSelf } from '@clevercloud/client/esm/api/v2/organisation.js';
import { notify, notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-email-list.js';

/**
 * @typedef {import('./cc-email-list.js').CcEmailList} CcEmailList
 * @typedef {import('./cc-email-list.types.js').EmailListStateLoaded} EmailListStateLoaded
 * @typedef {import('./cc-email-list.types.js').SecondaryAddressState} SecondaryAddressState
 * @typedef {import('./cc-email-list.types.js').AddEmailFormState} AddEmailFormState
 * @typedef {import('./cc-email-list.types.js').AddEmailError} AddEmailError
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcEmailList>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-email-list',
  params: {
    apiConfig: { type: Object },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    updateComponent('emailListState', { type: 'loading' });
    updateComponent('addEmailFormState', { type: 'idle' });
    component.resetAddEmailForm();

    const api = getApi(context.apiConfig, signal);

    /**
     * @param {string} address
     * @param {(emailListState: SecondaryAddressState) => void} callback
     */
    function updateSecondary(address, callback) {
      updateComponent(
        'emailListState',
        /** @param {EmailListStateLoaded} emailListState */
        (emailListState) => {
          const secondaryState = emailListState.emailList.secondaryAddresses.find((a) => a.address === address);
          if (secondaryState != null) {
            callback(secondaryState);
          }
        },
      );
    }

    api
      .fetchEmailAddresses()
      .then(({ self, secondary }) => {
        updateComponent('emailListState', {
          type: 'loaded',
          emailList: {
            primaryAddress: {
              type: 'idle',
              address: self.email,
              verified: self.emailValidated,
            },
            secondaryAddresses: secondary.map((secondaryAddress) => ({
              type: 'idle',
              address: secondaryAddress,
              verified: true,
            })),
          },
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('emailListState', { type: 'error' });
      });

    onEvent('cc-email-send-confirmation', (address) => {
      updateComponent(
        'emailListState',
        /** @param {EmailListStateLoaded} emailListState */
        (emailListState) => {
          emailListState.emailList.primaryAddress.type = 'sending-confirmation-email';
        },
      );

      api
        .sendConfirmationEmail()
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
        .catch(
          /** @param {Error} error */
          (error) => {
            console.error(error);
            notifyError(i18n('cc-email-list.primary.action.resend-confirmation-email.error', { address }));
          },
        )
        .finally(() => {
          updateComponent(
            'emailListState',
            /** @param {EmailListStateLoaded} emailListState */
            (emailListState) => {
              emailListState.emailList.primaryAddress.type = 'idle';
            },
          );
        });
    });

    onEvent('cc-email-add', (address) => {
      updateComponent(
        'addEmailFormState',
        /** @param {AddEmailFormState} emailListState */
        (emailListState) => {
          emailListState.type = 'adding';
        },
      );

      api
        .addSecondaryEmailAddress(address)
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

          component.resetAddEmailForm();
        })
        .catch(
          /** @param {Error & {id?: number}} error */
          (error) => {
            const errorCode = convertApiError(error.id);

            if (errorCode == null) {
              console.error(error);
              notifyError(i18n('cc-email-list.secondary.action.add.error', { address }));
            } else {
              updateComponent(
                'addEmailFormState',
                /** @param {AddEmailFormState} emailListState */
                (emailListState) => {
                  emailListState.errors = {
                    email: errorCode,
                  };
                },
              );
            }
          },
        )
        .finally(() => {
          updateComponent(
            'addEmailFormState',
            /** @param {AddEmailFormState} emailListState */
            (emailListState) => {
              emailListState.type = 'idle';
            },
          );
        });
    });

    onEvent('cc-email-delete', (address) => {
      updateSecondary(address, (secondaryAddressState) => {
        secondaryAddressState.type = 'deleting';
      });

      api
        .deleteSecondaryEmailAddress(address)
        .then(() => {
          notifySuccess(i18n('cc-email-list.secondary.action.delete.success', { address }));

          updateComponent(
            'emailListState',
            /** @param {EmailListStateLoaded} emailListState */
            (emailListState) => {
              emailListState.emailList.secondaryAddresses = emailListState.emailList.secondaryAddresses.filter(
                (a) => a.address !== address,
              );
            },
          );
        })
        .catch(
          /** @param {Error} error */
          (error) => {
            console.error(error);
            notifyError(i18n('cc-email-list.secondary.action.delete.error', { address }));
            updateSecondary(address, (secondaryAddressState) => {
              secondaryAddressState.type = 'idle';
            });
          },
        );
    });

    onEvent('cc-email-mark-as-primary', (address) => {
      updateSecondary(address, (secondaryAddressState) => {
        secondaryAddressState.type = 'marking-as-primary';
      });

      api
        .markSecondaryEmailAddressAsPrimary(address)
        .then(() => {
          notifySuccess(i18n('cc-email-list.secondary.action.mark-as-primary.success', { address }));

          if (component.emailListState.type === 'loaded') {
            const primaryAddress = component.emailListState.emailList.primaryAddress.address;

            updateComponent(
              'emailListState',
              /** @param {EmailListStateLoaded} emailListState */
              (emailListState) => {
                emailListState.emailList.primaryAddress.address = address;
              },
            );
            updateSecondary(address, (secondaryAddressState) => {
              secondaryAddressState.type = 'idle';
              secondaryAddressState.address = primaryAddress;
            });
          }
        })
        .catch(
          /** @param {Error} error */
          (error) => {
            console.error(error);
            notifyError(i18n('cc-email-list.secondary.action.mark-as-primary.error', { address }));
            updateSecondary(address, (secondaryAddressState) => {
              secondaryAddressState.type = 'idle';
            });
          },
        );
    });
  },
});

/**
 * @param {number} apiErrorId
 * @return {null|AddEmailError}
 */
function convertApiError(apiErrorId) {
  if (apiErrorId === 550) {
    return 'invalid';
  }
  if (apiErrorId === 101) {
    return 'already-defined';
  }
  if (apiErrorId === 1004) {
    return 'used';
  }
  return null;
}

// -- API calls
/**
 * @param {ApiConfig} apiConfig
 * @param {AbortSignal} signal
 */
function getApi(apiConfig, signal) {
  return {
    /**
     * @return {Promise<{self: {email: string, emailValidated: boolean}, secondary: Array<string>}>}
     */
    fetchEmailAddresses() {
      return Promise.all([this.fetchPrimaryEmailAddress(), this.fetchSecondaryEmailAddresses()]).then(
        ([self, secondary]) => {
          return { self, secondary };
        },
      );
    },

    /**
     * @return {Promise<{email: string, emailValidated: boolean}>}
     */
    fetchPrimaryEmailAddress() {
      return getSelf({}).then(sendToApi({ apiConfig, signal }));
    },

    /**
     * @return {Promise<Array<string>>}
     */
    fetchSecondaryEmailAddresses() {
      return getEmailAddresses().then(sendToApi({ apiConfig, signal }));
    },

    sendConfirmationEmail() {
      return sendConfirmationEmail().then(sendToApi({ apiConfig }));
    },

    /**
     * @param {string} address
     */
    addSecondaryEmailAddress(address) {
      return addEmailAddress({ email: address }, {}).then(sendToApi({ apiConfig }));
    },

    /**
     * @param {string} address
     */
    deleteSecondaryEmailAddress(address) {
      return removeEmailAddress({ email: address }).then(sendToApi({ apiConfig }));
    },

    /**
     * @param {string} address
     */
    markSecondaryEmailAddressAsPrimary(address) {
      return addEmailAddress(
        { email: address },
        {
          // eslint-disable-next-line camelcase
          make_primary: true,
        },
      ).then(sendToApi({ apiConfig }));
    },
  };
}
