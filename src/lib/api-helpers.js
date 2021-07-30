import { get as getApp } from '@clevercloud/client/esm/api/v2/application.js';
import { getAllInvoices, getInvoice } from '@clevercloud/client/esm/api/v4/billing.js';
import { getAllZones } from '@clevercloud/client/esm/api/v4/product.js';
import { addOauthHeader } from '@clevercloud/client/esm/oauth.browser.js';
import { pickNonNull } from '@clevercloud/client/esm/pick-non-null.js';
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { sendToApi } from './send-to-api.js';
import { asyncMap } from './utils.js';

export function fetchApp ({ apiConfig, signal, ownerId, appId }) {
  return getApp({ id: ownerId, appId }).then(sendToApi({ apiConfig, signal }));
}

export async function fetchInvoice ({ apiConfig, signal, ownerId, invoiceNumber }) {
  return getInvoice({ id: ownerId, invoiceNumber, type: '' })
    .then(sendToApi({ apiConfig, signal }))
    .then((invoice) => formatInvoice(apiConfig, ownerId, invoice));
}

export async function fetchInvoiceHtml ({ apiConfig, signal, ownerId, invoiceNumber }) {
  return getInvoice({ id: ownerId, invoiceNumber, type: '.html' })
    .then(sendToApi({ apiConfig, signal }));
}

export async function fetchAllInvoices ({ apiConfig, signal, ownerId }) {
  // We ask for all invoices by default for now
  return getAllInvoices({ id: ownerId, since: '2010-08-01T00:00:00.000Z' })
    .then(sendToApi({ apiConfig, signal }))
    .then((invoices) => {
      return asyncMap(invoices, async (i) => formatInvoice(apiConfig, ownerId, i));
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

// TODO: move to clever-client
/**
 * GET /v4/billing/price-system
 * @param {Object} params
 * @param {String} params.zone_id
 */
export function getPriceSystem (params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/billing/price-system`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['zone_id']),
    // no body
  });
}

export function fetchPriceSystem ({ signal, zoneId }) {
  // eslint-disable-next-line camelcase
  return getPriceSystem({ zone_id: zoneId })
    .then(sendToApi({ signal, cacheDelay: ONE_DAY }));
}

const RATES = {
  EUR: 1,
  USD: 1.1802,
  // others
  AUD: 1.5548,
  BGN: 1.9558,
  BRL: 6.696,
  CAD: 1.4849,
  CHF: 1.1045,
  CNY: 7.722,
  CZK: 26.233,
  DKK: 7.436,
  GBP: 0.86068,
  HKD: 9.17,
  HRK: 7.5748,
  HUF: 364.78,
  IDR: 17024.39,
  ILS: 3.9091,
  INR: 85.7605,
  ISK: 149.8,
  JPY: 128.75,
  KRW: 1340.88,
  MXN: 24.6616,
  MYR: 4.8937,
  NOK: 10.1653,
  NZD: 1.6948,
  PHP: 57.335,
  PLN: 4.6399,
  RON: 4.8865,
  RUB: 90.0115,
  SEK: 10.1935,
  SGD: 1.5899,
  THB: 36.746,
  TRY: 9.4313,
  ZAR: 17.6852,
};

export async function fetchCurrency ({ currencyCode }) {
  return {
    code: currencyCode,
    changeRate: RATES[currencyCode],
  };
}

export async function fetchAllCurrencies () {
  return Object.entries(RATES).map(([code, changeRate]) => ({ code, changeRate }));
}

export async function fetchAllZones ({ signal }) {
  return getAllZones()
    .then(sendToApi({ signal, cacheDelay: ONE_DAY }));
}
