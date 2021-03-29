import { get as getApp } from '@clevercloud/client/esm/api/v2/application.js';
import { addOauthHeader } from '@clevercloud/client/esm/oauth.browser.js';
import { pickNonNull } from '@clevercloud/client/esm/pick-non-null.js';
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
import { sendToApi } from './send-to-api.js';
import { asyncMap } from './utils.js';

export function fetchApp ({ apiConfig, signal, ownerId, appId }) {
  return getApp({ id: ownerId, appId }).then(sendToApi({ apiConfig, signal }));
}

// TODO: move to clever-client
function getInvoice (params) {
  return Promise
    .resolve({
      method: 'get',
      url: `/v4/billing/organisations/${params.id}/invoices/${params.invoiceNumber}${params.type}`,
      headers: { Accept: 'application/json' },
      // no queryParams
      // no body
    });
}

export async function fetchAllInvoices ({ apiConfig, signal, ownerId }) {
  // We ask for all invoices by default for now
  return getAllInvoices({ id: ownerId, since: '2010-08-01T00:00:00.000Z' })
    .then(sendToApi({ apiConfig, signal }))
    .then((invoices) => {
      return asyncMap(invoices, async (i) => formatInvoice(apiConfig, ownerId, i));
    });
}

// TODO: move to clever-client
function getAllInvoices (params) {
  return Promise
    .resolve({
      method: 'get',
      url: `/v4/billing/organisations/${params.id}/invoices`,
      headers: { Accept: 'application/json' },
      queryParams: pickNonNull(params, ['since']),
      // no body
    });
}

async function formatInvoice (apiConfig, ownerId, rawInvoice) {
  return {
    number: rawInvoice.invoice_number,
    emissionDate: rawInvoice.emission_date,
    type: rawInvoice.type || 'INVOICE',
    status: rawInvoice.status,
    total: {
      amount: rawInvoice.total_tax.amount + rawInvoice.total_tax_excluded.amount,
      currency: rawInvoice.total_tax_excluded.currency,
    },
    downloadUrl: await getDownloadUrl(apiConfig, ownerId, rawInvoice.invoice_number),
    paymentUrl: getPaymentUrl(ownerId, rawInvoice.invoice_number),
  };
}

// TODO: move to clever-client
function getDownloadUrl (apiConfig, ownerId, invoiceNumber) {
  return getInvoice({ id: ownerId, invoiceNumber, type: '.pdf' })
    .then(prefixUrl(apiConfig.API_HOST))
    .then(addOauthHeader(apiConfig))
    .then((requestParams) => {
      const url = new URL(requestParams.url);
      url.searchParams.set('authorization', btoa(requestParams.headers.Authorization));
      return url.toString();
    });
}

function getPaymentUrl (ownerId, invoiceNumber) {
  return (ownerId == null || ownerId.startsWith('user_'))
    ? `/users/me/invoices/${invoiceNumber}`
    : `/organisations/${ownerId}/invoices/${invoiceNumber}`;
}
