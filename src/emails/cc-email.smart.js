import './cc-email.js';
import '../smart/cc-smart-container.js';
// eslint-disable-next-line camelcase
import { todo_addEmailAddress, todo_getEmailAddresses, todo_removeEmailAddress } from '@clevercloud/client/esm/api/v2/user.js';
import { i18n } from '../lib/i18n.js';
import { fromCustomEvent, LastPromise, unsubscribeWithSignal, withLatestFrom } from '../lib/observables.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-email',
  params: {
    apiConfig: { type: Object },
  },
  onConnect (container, component, context$, disconnectSignal) {
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
        component.state = 'error-loading';
      }),
      emails_lp.value$.subscribe(({ self, secondary }) => {
        component.state = 'loaded';
        component.primary = {
          address: {
            value: self.email,
            verified: self.emailValidated,
          },
        };
        component.secondary = {
          addresses: secondary.map((a) => ({
            address: {
              value: a,
              verified: true,
            },
          })),
        };
      }),
      /* endregion*/

      /* region SEND_CONFIRMATION_EMAIL */
      onSendConfirmationEmail$.subscribe(([address, { apiConfig }]) => {
        setStateOnPrimary(component, 'sending-confirmation-email');

        sendConfirmationEmail({ apiConfig, address })
          .finally(() => {
            setStateOnPrimary(component, null);
          });
      }),
      /* endregion*/

      /* region ADD_SECONDARY_ADDRESS */
      onAddSecondaryEmail$.subscribe(([address, { apiConfig }]) => {
        setStateOnSecondary(component, 'adding');
        component._addAddressInputError = null;

        addSecondaryEmailAddress({ apiConfig, address })
          .then(() => {
            component.reset();
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
              // maybe in this case, we should not show a toast error
              setStateOnSecondary(component, null);
              component._addAddressInputError = inputError;
            }
          })
          .finally(() => {
            setStateOnSecondary(component, null);
          });
      }),

      /* endregion*/

      /* region DELETE_SECONDARY_ADDRESS */
      onDeleteSecondaryEmail$.subscribe(([address, { apiConfig }]) => {
        setStateOnSecondaryEmailAddress(component, address, 'deleting');

        deleteSecondaryEmailAddress({ apiConfig, address })
          .then(() => {
            component.secondary = {
              addresses: [
                ...component.secondary.addresses.filter((a) => a.address.value !== address),
              ],
              state: null,
            };
          });
      }),
      /* endregion*/

      /* region MARK_AS_PRIMARY */
      onMarkSecondaryEmailAsPrimary$.subscribe(([address, { apiConfig }]) => {
        setStateOnSecondaryEmailAddress(component, address, 'marking-as-primary');

        markSecondaryEmailAddressAsPrimary({ apiConfig, address })
          .then(() => {
            emails_lp.push((signal) => fetchEmailAddresses({ apiConfig, signal }));
          })
          .finally(() => {
            // setStateOnSecondaryEmailAddress(component, address, null);
          });
      }),

      /* endregion */

      context$.subscribe(({ apiConfig }) => {
        component.reset();
        component.state = 'loading';
        component.primary = null;
        component.secondary = null;

        if (apiConfig != null) {
          emails_lp.push((signal) => fetchEmailAddresses({ apiConfig, signal }));
        }
      }),
    ]);
  },
});

function setStateOnSecondaryEmailAddress (component, address, state) {
  component.secondary = {
    addresses: [
      ...component.secondary.addresses.filter((a) => a.address.value !== address),
      {
        ...component.secondary.addresses.find((a) => a.address.value === address),
        state: state,
      },
    ],
    state: component.secondary.state,
  };
}

function setStateOnPrimary (component, state) {
  component.primary = {
    ...component.primary,
    state: state,
  };
}

function setStateOnSecondary (component, state) {
  component.secondary = {
    ...component.secondary,
    state: state,
  };
}

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
  return withNotifications(
    { key: 'cc-email.primary.action.resend-confirmation-email', data: { address } },
    api.sendConfirmationEmail({ apiConfig }),
  );
}

function addSecondaryEmailAddress ({ apiConfig, address }) {
  return withNotifications(
    'cc-email.secondary.action.add',
    api.addSecondaryEmailAddress({ apiConfig, address }),
  );
}

function deleteSecondaryEmailAddress ({ apiConfig, address }) {
  return withNotifications(
    'cc-email.secondary.action.delete',
    api.deleteSecondaryEmailAddress({ apiConfig, address }),
  );
}

function markSecondaryEmailAddressAsPrimary ({ apiConfig, address }) {
  return withNotifications(
    'cc-email.secondary.action.mark-as-primary',
    api.markSecondaryEmailAddressAsPrimary({ apiConfig, address }),
  );
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

function withNotifications (key, promise) {
  const k = typeof key === 'string' ? key : key.key;
  const d = typeof key === 'string' ? undefined : key.data;
  return promise
    .then((r) => {
      console.log(i18n(`${k}.success`, d));
      return r;
    })
    .catch((e) => {
      console.log(i18n(`${k}.error`, d));
      throw e;
    });
}
