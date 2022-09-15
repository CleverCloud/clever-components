import './cc-email.js';
import '../cc-smart-container/cc-smart-container.js';
// eslint-disable-next-line camelcase
import { todo_addEmailAddress, todo_getEmailAddresses, todo_removeEmailAddress } from '@clevercloud/client/esm/api/v2/user.js';
import { i18n } from '../../lib/i18n.js';
import { notify, notifyError, notifySuccess } from '../../lib/notifications.js';
import { fromCustomEvent, LastPromise, unsubscribeWithSignal, withLatestFrom } from '../../lib/observables.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineComponent } from '../../lib/smart-manager.js';
import { createStateHelper } from './stateHelpers.js';

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
     * @type {StateHelper<CcEmailData>}
     */
    const stateHelper = createStateHelper(component);

    /**
     * @type {InnerStateHelper<EmailAddress, PrimaryState>}
     */
    const primaryStateHelper = stateHelper.createInnerStateHelper('primary');
    /**
     * @type {InnerListStateHelper<EmailAddress, SecondaryState>}
     */
    const secondaryStateHelper = stateHelper.createInnerListStateHelper('secondaryAddresses');
    const findSecondaryByAddress = (address) => (d) => d.address === address;

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
      // region => When component loads,
      // 1. we reset the component
      // 2. we fetch primary and secondary email addresses
      context$.subscribe(({ apiConfig }) => {
        component.reset();

        if (apiConfig != null) {
          emails_lp.push((signal) => fetchEmailAddresses({ apiConfig, signal }));
        }
      }),
      // endregion

      // region => When server responds with error,
      // 1. we log error
      // 2. we set component state to error
      emails_lp.error$.subscribe((error) => {
        console.error(error);
        stateHelper.mutator.error();
      }),
      // endregion

      // region => When server responds with success,
      // 1. we set component state to loaded with the right data
      emails_lp.value$.subscribe(({ self, secondary }) => {
        stateHelper.mutator.data(
          {
            primary: primaryStateHelper.create({
              address: self.email,
              verified: self.emailValidated,
            }),
            secondaryAddresses: secondaryStateHelper.create(
              secondary.map((a) => ({
                address: a,
                verified: true,
              })),
            ),
          },
        );
      }),
      // endregion

      // region => When user asks for sending a new confirmation email
      // 1. change 'primary' state to 'sending-confirmation-email'
      // 2. call HTTP endpoint
      // 2.a on error: display an error toast
      // 2.b on success: display a success toast
      // 3. reset 'primary' state to 'idle'
      onSendConfirmationEmail$.subscribe(([address, { apiConfig }]) => {
        primaryStateHelper.setState('sending-confirmation-email');

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
            primaryStateHelper.resetState();
          });
      }),
      // endregion

      // region => When user adds a new email address
      // 1. change 'form' state to 'adding'
      // 2. call HTTP endpoint
      // 2.a on error:
      // 2.a.1. if error is identified, change 'form' state to 'error'
      // 2.a.b. else show error toast and change 'form' state to 'idle'
      // 2.b on success:
      // 2.b.1 show success toast
      // 2.b.2 reset form
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
            else {
              notifyError(component, i18n('cc-email.secondary.action.add.error'));
              component.formIdle();
            }
          });
      }),
      // endregion

      // region => When user deletes a secondary email address
      // 1. change item state to 'deleting'
      // 2. call HTTP endpoint
      // 2.a on error:
      // 2.a.1 show error toast
      // 2.a.2 reset item state
      // 2.b on success:
      // 2.b.1 show success toast
      // 2.b.2 remove item
      onDeleteSecondaryEmail$.subscribe(([address, { apiConfig }]) => {
        const itemFinder = findSecondaryByAddress(address);

        secondaryStateHelper.forItem(itemFinder).setState('deleting');

        deleteSecondaryEmailAddress({ apiConfig, address })
          .then(() => {
            notifySuccess(component, i18n('cc-email.secondary.action.delete.success'));
            secondaryStateHelper.remove(itemFinder);
          })
          .catch(() => {
            notifyError(component, i18n('cc-email.secondary.action.delete.error'));
            secondaryStateHelper.forItem(itemFinder).resetState();
          });
      }),
      // endregion

      // region => When user marks a secondary email address as primary
      // 1. change item state to 'marking-as-primary'
      // 2. call HTTP endpoint
      // 2.a on error:
      // 2.a.1 show error toast
      // 2.a.2 reset item state
      // 2.b on success:
      // 2.b.1 show success toast
      // 2.b.2 make secondary primary, and primary secondary
      onMarkSecondaryEmailAsPrimary$.subscribe(([address, { apiConfig }]) => {
        const itemFinder = findSecondaryByAddress(address);

        secondaryStateHelper.forItem(itemFinder).setState('marking-as-primary');

        markSecondaryEmailAddressAsPrimary({ apiConfig, address })
          .then(() => {
            notifySuccess(component, i18n('cc-email.secondary.action.mark-as-primary.success'));

            const primary = primaryStateHelper.getData().address;
            primaryStateHelper.set({
              address: address,
              verified: true,
            });
            secondaryStateHelper.forItem(itemFinder).set({
              address: primary,
              verified: true,
            });
          })
          .catch(() => {
            notifyError(component, i18n('cc-email.secondary.action.mark-as-primary.error'));
            secondaryStateHelper.forItem(itemFinder).resetState();
          });
      }),
      // endregion

    ]);
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
    // throw new Error('fatal');
    return {};
  },

  addSecondaryEmailAddress ({ apiConfig, address }) {
    if (address === 'oups@oups.com') {
      throw new Error('fatal');
    }
    if (address.length > 100) {
      const error = new Error('invalid');
      error.id = 550;
      throw error;
    }
    if ([...secondaryEmailAddresses, primaryEmailAddress.email].includes(address)) {
      const error = new Error('already-defined');
      error.id = 101;
      throw error;
    }
    secondaryEmailAddresses.push(address);
    return {};
  },

  deleteSecondaryEmailAddress ({ apiConfig, address }) {
    // throw new Error('fatal');
    secondaryEmailAddresses = secondaryEmailAddresses.filter((a) => a !== address);
    return {};
  },

  markSecondaryEmailAddressAsPrimary ({ apiConfig, address }) {
    // throw new Error('fatal');
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
