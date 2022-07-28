import './cc-email.js';
import '../smart/cc-smart-container.js';
// eslint-disable-next-line camelcase
import { todo_addEmailAddress, todo_getEmailAddresses, todo_removeEmailAddress } from '@clevercloud/client/esm/api/v2/user.js';
import { i18n } from '../lib/i18n.js';
import { notify, notifyError, notifySuccess } from '../lib/notifications.js';
import { fromCustomEvent, LastPromise, unsubscribeWithSignal, withLatestFrom } from '../lib/observables.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

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
        stateHelper(component).loadingError();
        // component.state = { type: 'error', error: 'loading' };
      }),
      emails_lp.value$.subscribe(({ self, secondary }) => {
        stateHelper(component).newData(
          {
            primary: {
              address: {
                value: self.email,
                verified: self.emailValidated,
              },
            },
            secondary: {
              addresses: secondary.map((a) => ({
                address: {
                  value: a,
                  verified: true,
                },
              })),
            },
          },
        );
        // component.state = {
        //   type: 'loaded',
        //   data: {
        //     primary: {
        //       address: {
        //         value: self.email,
        //         verified: self.emailValidated,
        //       },
        //     },
        //     secondary: {
        //       addresses: secondary.map((a) => ({
        //         address: {
        //           value: a,
        //           verified: true,
        //         },
        //       })),
        //     },
        //   },
        // };
      }),
      /* endregion*/

      /* region SEND_CONFIRMATION_EMAIL */
      onSendConfirmationEmail$.subscribe(([address, { apiConfig }]) => {
        setStateOnPrimary(component, 'sending-confirmation-email');

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
            setStateOnPrimary(component, null);
          });
      }),
      /* endregion*/

      /* region ADD_SECONDARY_ADDRESS */
      onAddSecondaryEmail$.subscribe(([address, { apiConfig }]) => {
        setStateOnSecondary(component, 'adding');

        addSecondaryEmailAddress({ apiConfig, address })
          .then(() => {
            notify(component, {
              intent: 'info',
              title: i18n('cc-email.primary.action.add.success.title'),
              message: i18n('cc-email.primary.action.add.success.message', { address }),
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
              setStateOnSecondary(component, null);
              component.formError(inputError);
            }
          })
          .catch(() => notifyError(component, i18n('cc-email.secondary.action.add.error')))
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
            notifySuccess(component, i18n('cc-email.secondary.action.delete.success'));

            stateHelper(component).newDataFn((oldData) => {
              return {
                ...oldData,
                secondary: {
                  addresses: [
                    ...oldData.secondary.addresses.filter((a) => a.address.value !== address),
                  ],
                },
              };
            });

            // component.state = {
            //   type: 'loaded',
            //   data: {
            //     ...component.state.data,
            //     secondary: {
            //       addresses: [
            //         ...component.state.data.secondary.addresses.filter((a) => a.address.value !== address),
            //       ],
            //     },
            //   },
            // };
          })
          .catch(() => notifyError(component, i18n('cc-email.secondary.action.delete.error')));
      }),
      /* endregion*/

      /* region MARK_AS_PRIMARY */
      onMarkSecondaryEmailAsPrimary$.subscribe(([address, { apiConfig }]) => {
        setStateOnSecondaryEmailAddress(component, address, 'marking-as-primary');

        markSecondaryEmailAddressAsPrimary({ apiConfig, address })
          .then(() => {
            notifySuccess(component, i18n('cc-email.secondary.action.mark-as-primary.success'));

            emails_lp.push((signal) => fetchEmailAddresses({ apiConfig, signal }));
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
  },
});

function setStateOnSecondaryEmailAddress (component, address, state) {
  stateHelper(component).newDataFn((oldData) => {
    return {
      ...oldData,
      secondary: {
        addresses: oldData.secondary.addresses.map((a) => {
          if (a.address.value === address) {
            return {
              ...a,
              state,
            };
          }
          else {
            return a;
          }
        }),
        state: oldData.secondary.state,
      },
    };
  });

  // component.state = {
  //   type: 'loaded',
  //   data: {
  //     ...component.state.data,
  //     secondary: {
  //       addresses: component.state.data.secondary.addresses.map((a) => {
  //         if (a.address.value === address) {
  //           return {
  //             ...a,
  //             state,
  //           };
  //         }
  //         else {
  //           return a;
  //         }
  //       }),
  //       state: component.state.data.secondary.state,
  //     },
  //   },
  // };
}

function setStateOnPrimary (component, state) {
  stateHelper(component).newDataFn((oldData) => {
    return {
      ...oldData,
      primary: {
        ...oldData.primary,
        state: state,
      },
    };
  });
  // component.state = {
  //   type: 'loaded',
  //   data: {
  //     ...component.state.data,
  //     primary: {
  //       ...component.state.data.primary,
  //       state: state,
  //     },
  //   },
  // };
}

function setStateOnSecondary (component, state) {
  stateHelper(component).newDataFn((oldData) => {
    return {
      ...oldData,
      secondary: {
        ...oldData.secondary,
        state: state,
      },
    };
  });
  // component.state = {
  //   type: 'loaded',
  //   data: {
  //     ...component.state.data,
  //     secondary: {
  //       ...component.state.data.secondary,
  //       state: state,
  //     },
  //   },
  // };
}

/**
 * @param {CcEmail} component
 * @template T
 */
function stateHelper (component) {
  return {
    loading () {
      component.state = {
        type: 'loading',
      };
    },
    loadingError () {
      component.state = {
        type: 'error',
        error: 'loading',
      };
    },
    /**
     * @param {CcEmailData} data
     */
    newData (data) {
      component.state = {
        type: 'loaded',
        data,
      };
    },
    /**
     * @param {(oldData: CcEmailData) => CcEmailData} dataFn
     */
    newDataFn (dataFn) {
      this.newData(dataFn(component.data));
    },
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
  emailValidated: false,
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
