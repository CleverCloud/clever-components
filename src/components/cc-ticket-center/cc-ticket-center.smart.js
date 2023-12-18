import './cc-ticket-center.js';
import '../cc-smart-container/cc-smart-container.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { defineSmartComponentWithObservables } from '../../lib/define-smart-component-with-observables.js';
import { LastPromise, unsubscribeWithSignal } from '../../lib/observables.js';
import { sendToGenericApi } from '../../lib/send-to-api.js';

defineSmartComponentWithObservables({
  selector: 'cc-ticket-center',
  params: {
    apiConfig: { type: Object },
    hmac: { type: String },
    orgaId: { type: String },
    userEmail: { type: String },
    participantsEmails: { type: Array },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const tickets_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      tickets_lp.error$.subscribe(console.error),
      tickets_lp.error$.subscribe(() => (component.error = true)),
      tickets_lp.value$.subscribe((applications) => (component.applications = applications)),

      context$.subscribe(({ apiConfig, hmac, orgaId, userEmail, participantsEmails }) => {

        component.error = false;
        component.tickets = null;

        if (apiConfig != null && hmac != null && orgaId != null && userEmail != null) {
          tickets_lp.push((signal) => fetchTickets({ apiConfig, signal, hmac, orgaId, userEmail }));
        }

      }),

    ]);
  },
});

function fetchTickets ({ apiConfig, signal, hmac, orgaId, userEmail }) {
  return sendToGenericApi({ apiConfig, signal })({
    url: `/${orgaId}/tickets`,
    headers: {
      Authorization: `Hmac ${hmac}`,
      'X-User-Email': userEmail,
    },
  });
}
