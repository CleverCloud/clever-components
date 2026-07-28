import {
  CREATE_PROFILE_EMAIL_ADDRESS_ERROR_CODES,
  CreateProfileEmailAddressCommand,
} from '@clevercloud/client/cc-api-commands/profile/create-profile-email-address-command.js';
import { DeleteProfileEmailAddressCommand } from '@clevercloud/client/cc-api-commands/profile/delete-profile-email-address-command.js';
import { ListProfileEmailAddressCommand } from '@clevercloud/client/cc-api-commands/profile/list-profile-email-address-command.js';
import { RequestProfileEmailConfirmationCommand } from '@clevercloud/client/cc-api-commands/profile/request-profile-email-confirmation-command.js';
import { SetProfilePrimaryEmailAddressCommand } from '@clevercloud/client/cc-api-commands/profile/set-profile-primary-email-address-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notify, notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-email-list.js';

/**
 * @import { CcEmailList } from './cc-email-list.js'
 * @import { EmailListStateLoaded, SecondaryAddressState, AddEmailFormState, AddEmailError } from './cc-email-list.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-email-list',
  params: {
    apiConfig: { type: Object },
  },
  /**
   * @param {OnContextUpdateArgs<CcEmailList>} args
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
      .then(({ primaryAddress, secondaryAddresses }) => {
        updateComponent('emailListState', {
          type: 'loaded',
          emailList: {
            primaryAddress: {
              type: 'idle',
              address: primaryAddress.address,
              verified: primaryAddress.isVerified,
            },
            secondaryAddresses: secondaryAddresses.map((secondaryAddress) => ({
              type: 'idle',
              address: secondaryAddress.address,
              verified: secondaryAddress.isVerified,
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
          /** @param {Error & {code?: string}} error */
          (error) => {
            const errorCode = convertApiError(error.code);

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
 * @param {string} apiErrorCode
 * @return {null|AddEmailError}
 */
function convertApiError(apiErrorCode) {
  if (apiErrorCode === CREATE_PROFILE_EMAIL_ADDRESS_ERROR_CODES.INVALID_FORMAT) {
    return 'invalid';
  }
  if (apiErrorCode === CREATE_PROFILE_EMAIL_ADDRESS_ERROR_CODES.ALREADY_DEFINED) {
    return 'already-defined';
  }
  if (apiErrorCode === CREATE_PROFILE_EMAIL_ADDRESS_ERROR_CODES.ALREADY_USED) {
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
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);

  return {
    /**
     * @return {Promise<{primaryAddress: {address: string, isVerified: boolean}, secondaryAddresses: Array<{address: string, isVerified: boolean}>}>}
     */
    fetchEmailAddresses() {
      return ccApiClient.send(new ListProfileEmailAddressCommand(), { signal });
    },

    sendConfirmationEmail() {
      return ccApiClient.send(new RequestProfileEmailConfirmationCommand());
    },

    /**
     * @param {string} address
     */
    addSecondaryEmailAddress(address) {
      return ccApiClient.send(new CreateProfileEmailAddressCommand({ address }));
    },

    /**
     * @param {string} address
     */
    deleteSecondaryEmailAddress(address) {
      return ccApiClient.send(new DeleteProfileEmailAddressCommand({ address }));
    },

    /**
     * @param {string} address
     */
    markSecondaryEmailAddressAsPrimary(address) {
      return ccApiClient.send(new SetProfilePrimaryEmailAddressCommand({ address }));
    },
  };
}
