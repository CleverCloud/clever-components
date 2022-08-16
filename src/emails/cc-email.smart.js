import './cc-email.js';
import '../smart/cc-smart-container.js';
// eslint-disable-next-line camelcase
import { todo_addEmailAddress, todo_getEmailAddresses, todo_removeEmailAddress } from '@clevercloud/client/esm/api/v2/user.js';
import { i18n } from '../lib/i18n.js';
import { notify, notifyError, notifySuccess } from '../lib/notifications.js';
import { fromCustomEvent, LastPromise, unsubscribeWithSignal, withLatestFrom } from '../lib/observables.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';
import { set, unset } from './objectHelper.js';
import { createStateMutator } from './stateHelpers.js';

defineComponent({
  selector: 'cc-email',
  params: {
    apiConfig: { type: Object },
  },
  /**
   *
   * @param container
   * @param {CcEmail} component
   * @param context$
   * @param disconnectSignal
   */
  onConnect (container, component, context$, disconnectSignal) {
    /**
     * @type {StateMutator<CcEmailData>}
     */
    const stateMutator = createStateMutator(component);

    const emails_lp = new LastPromise();

    const onSendConfirmationEmail$ = fromCustomEvent(component, 'cc-email:send-confirmation-email')
      .pipe(withLatestFrom(context$));
    const onAddSecondaryEmail$ = fromCustomEvent(component, 'cc-email:add')
      .pipe(withLatestFrom(context$));
    const onDeleteSecondaryEmail$ = fromCustomEvent(component, 'cc-email:delete')
      .pipe(withLatestFrom(context$));
    const onMarkSecondaryEmailAsPrimary$ = fromCustomEvent(component, 'cc-email:mark-as-primary')
      .pipe(withLatestFrom(context$));

    unsubscribeWithSignal(disconnectSignal, [
      /* region LOAD_PRIMARY */
      emails_lp.error$.subscribe(console.error),
      emails_lp.error$.subscribe(() => {
        stateMutator.error();
      }),
      emails_lp.value$.subscribe(({ self, secondary }) => {
        stateMutator.data(
          {
            primary: {
              address: {
                value: self.email,
                verified: self.emailValidated,
              },
            },
            secondaryAddresses: secondary.map((a) => ({
              address: {
                value: a,
                verified: true,
              },
            })),
          },
        );
      }),
      /* endregion*/

      /* region SEND_CONFIRMATION_EMAIL */
      onSendConfirmationEmail$.subscribe(([address, { apiConfig }]) => {
        setStateOnPrimary('sending-confirmation-email');

        sendConfirmationEmail({ apiConfig, address })
          .then(() => notify(component, {
            intent: 'info',
            title: i18n('cc-email.primary.action.resend-confirmation-email.success.title'),
            message: i18n('cc-email.primary.action.resend-confirmation-email.success.message', { address }),
            options: {
              timeout: 0,
              closeable: true,
            },
          }))
          .catch(() => notifyError(component, i18n('cc-email.primary.action.resend-confirmation-email.error')))
          .finally(() => {
            setStateOnPrimary(null);
          });
      }),
      /* endregion*/

      /* region ADD_SECONDARY_ADDRESS */
      onAddSecondaryEmail$.subscribe(([address, { apiConfig }]) => {
        component.formAdding();

        addSecondaryEmailAddress({ apiConfig, address })
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
            component.resetForm();
          })
          .catch((error) => {
            let inputError;
            if (error.id === 550) {
              inputError = 'invalid';
            }
            else if (error.id === 101) {
              inputError = 'already-defined';
            }
            else if (error.id === 1004) {
              inputError = 'used';
            }

            if (inputError) {
              component.formError(inputError);
            }
          })
          .catch(() => notifyError(component, i18n('cc-email.secondary.action.add.error')))
          .finally(() => {
            component.formIdle();
          });
      }),

      /* endregion*/

      /* region DELETE_SECONDARY_ADDRESS */
      onDeleteSecondaryEmail$.subscribe(([address, { apiConfig }]) => {
        setStateOnSecondaryEmailAddress(address, 'deleting');

        deleteSecondaryEmailAddress({ apiConfig, address })
          .then(() => {
            notifySuccess(component, i18n('cc-email.secondary.action.delete.success'));

            stateMutator.data((oldData) => {
              const index = oldData.secondaryAddresses.findIndex((a) => a.address.value === address);
              return unset(oldData, `secondaryAddresses[${index}]`);
            });
          })
          .catch(() => notifyError(component, i18n('cc-email.secondary.action.delete.error')));
      }),
      /* endregion*/

      /* region MARK_AS_PRIMARY */
      onMarkSecondaryEmailAsPrimary$.subscribe(([address, { apiConfig }]) => {
        setStateOnSecondaryEmailAddress(address, 'marking-as-primary');

        markSecondaryEmailAddressAsPrimary({ apiConfig, address })
          .then(() => {
            notifySuccess(component, i18n('cc-email.secondary.action.mark-as-primary.success'));

            stateMutator.data((oldData) => {
              const index = oldData.secondaryAddresses.findIndex((a) => a.address.value === address);
              const primary = oldData.primary.address.value;
              const m1 = set(oldData, 'primary.address.value', address);
              return set(m1, `secondaryAddresses[${index}]`, {
                address: {
                  value: primary,
                  verified: true,
                },
              });
            });

          })
          .catch(() => notifyError(component, i18n('cc-email.secondary.action.mark-as-primary.error')))
          .finally(() => {
            // setStateOnSecondaryEmailAddress(component, address, null);
          });
      }),

      /* endregion */

      context$.subscribe(({ apiConfig }) => {
        component.reset();

        if (apiConfig != null) {
          emails_lp.push((signal) => fetchEmailAddresses({ apiConfig, signal }));
        }
      }),
    ]);

    function setStateOnSecondaryEmailAddress (address, state) {
      stateMutator.data((oldData) => {
        const index = oldData.secondaryAddresses.findIndex((a) => a.address.value === address);

        return set(oldData, `secondaryAddresses[${index}].state`, state);
      });
    }

    function setStateOnPrimary (state) {
      stateMutator.data((oldData) => {
        return set(oldData, 'primary.state', state);
      });
    }
  },
});

// -- API calls

const RemoteApi = {

  fetchPrimaryEmailAddress ({ apiConfig, signal }) {
    return Promise.resolve({
      method: 'get',
      url: `/v2/self`,
      headers: { Accept: 'application/json' },
      // no query params
      // no body
    })
      .then(sendToApi({ apiConfig, signal }));
  },

  fetchSecondaryEmailAddresses ({ apiConfig, signal }) {
    return todo_getEmailAddresses()
      .then(sendToApi({ apiConfig, signal }));
  },

  sendConfirmationEmail ({ apiConfig }) {
    return Promise.resolve({
      method: 'get',
      url: `/v2/self/confirmation_email`,
      headers: { Accept: 'application/json' },
      // no query params
      // no body
    })
      .then(sendToApi({ apiConfig }));
  },

  addSecondaryEmailAddress ({ apiConfig, address }) {
    return todo_addEmailAddress({ email: address }, {})
      .then(sendToApi({ apiConfig }));
  },

  deleteSecondaryEmailAddress ({ apiConfig, address }) {
    return todo_removeEmailAddress({ email: address })
      .then(sendToApi({ apiConfig }));
  },

  markSecondaryEmailAddressAsPrimary ({ apiConfig, address }) {
    return todo_addEmailAddress({ email: address }, {
      // eslint-disable-next-line camelcase
      make_primary: true,
    })
      .then(sendToApi({ apiConfig }));
  },
};

const primaryEmailAddress = {
  email: 'mock@domain.com',
  emailValidated: true,
};
let secondaryEmailAddresses = [
  'secondary.1.mock@domain.com',
  'secondary.2.mock@domain.com',
  'anotherSecondary.2.mock@domain.com',
];
const MockApi = {
  fetchPrimaryEmailAddress ({ apiConfig, signal }) {
    return primaryEmailAddress;
  },

  fetchSecondaryEmailAddresses: function ({ apiConfig, signal }) {
    return secondaryEmailAddresses;
  },

  sendConfirmationEmail ({ apiConfig }) {
    return {};
  },

  addSecondaryEmailAddress ({ apiConfig, address }) {
    secondaryEmailAddresses.push(address);
    return {};
  },

  deleteSecondaryEmailAddress ({ apiConfig, address }) {
    secondaryEmailAddresses = secondaryEmailAddresses.filter((a) => a !== address);
    return {};
  },

  markSecondaryEmailAddressAsPrimary ({ apiConfig, address }) {
    secondaryEmailAddresses = secondaryEmailAddresses.filter((a) => a !== address);
    secondaryEmailAddresses.push(primaryEmailAddress.email);
    primaryEmailAddress.email = address;
    return {};
  },
};

const api = getApi(true);

function fetchEmailAddresses ({ apiConfig, signal }) {
  return Promise.all([
    api.fetchPrimaryEmailAddress({ apiConfig, signal }),
    api.fetchSecondaryEmailAddresses({ apiConfig, signal }),
  ]).then(([self, secondary]) => {
    return { self, secondary };
  });
}

function sendConfirmationEmail ({ apiConfig, address }) {
  return api.sendConfirmationEmail({ apiConfig });
}

function addSecondaryEmailAddress ({ apiConfig, address }) {
  return api.addSecondaryEmailAddress({ apiConfig, address });
}

function deleteSecondaryEmailAddress ({ apiConfig, address }) {
  return api.deleteSecondaryEmailAddress({ apiConfig, address });
}

function markSecondaryEmailAddressAsPrimary ({ apiConfig, address }) {
  return api.markSecondaryEmailAddressAsPrimary({ apiConfig, address });
}

function getApi (mock) {
  if (!mock) {
    return RemoteApi;
  }
  return new Proxy(MockApi, {
    get (target, prop, receiver) {
      return function () {
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve(), 500);
        })
          .then(() => {
            return target[prop].apply(this, arguments);
          });
      };
    },
  });
}
