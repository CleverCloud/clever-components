import { get as getApp } from '@clevercloud/client/esm/api/v2/application.js';
import { getAllInvoices, getInvoice } from '@clevercloud/client/esm/api/v4/billing.js';
import { addOauthHeader } from '@clevercloud/client/esm/oauth.browser.js';
import { pickNonNull } from '@clevercloud/client/esm/pick-non-null.js';
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { sendToApi } from './send-to-api.js';
import { asyncMap } from './utils.js';
import { getAllZones } from '@clevercloud/client/esm/api/v4/product.js';

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
  return [{"city":"Singapore","country":"Singapore","countryCode":"SG","id":"3b9a58f4-bab4-439b-8662-e200d9805dba","lat":1.3143,"lon":103.7038,"name":"sgp","tags":["infra:ovh","for:applications"]},{"city":"Paris","country":"France","countryCode":"FR","id":"aad32a21-24f8-40b3-a750-baab218d927b","lat":48.8566,"lon":2.3522,"name":"par","tags":["infra:clever-cloud","for:applications"]},{"city":"Paris","country":"France","countryCode":"FR","displayName":"Testing environment","id":"43058982-bd36-4d87-a0e6-f1299b2c479a","lat":48.8566,"lon":2.3522,"name":"par0","tags":["infra:clever-cloud","for:applications","scope:private"]},{"city":"Montreal","country":"Canada","countryCode":"CA","id":"d62b134a-2671-4bba-8c46-b9a09a47aedd","lat":45.5017,"lon":-73.5673,"name":"mtl","tags":["infra:ovh","for:applications"]},{"city":"Roubaix","country":"France","countryCode":"FR","id":"b9bd85cc-62db-492f-94f5-ad3e47367d8e","lat":50.6901,"lon":3.1613,"name":"rbx","tags":["infra:ovh","for:applications"]},{"city":"Warsaw","country":"Poland","countryCode":"PL","id":"83923989-e9e8-4070-a371-3aafc2c4b9e3","lat":52.2331,"lon":20.9208,"name":"wsw","tags":["for:applications","infra:ovh"]},{"city":"Paris","country":"France","countryCode":"FR","displayName":"GPUs-enabled zone","id":"b4b05c1c-87a8-4e20-9e90-2b19214059b6","lat":48.8566,"lon":2.3522,"name":"clevergrid","tags":["for:applications-ml","infra:clever-cloud"]},{"city":"Paris","country":"France","countryCode":"FR","displayName":"Private PostgreSQL cluster","id":"47f4b372-d49e-4d26-8b1b-558a6c3de488","lat":48.8566,"lon":2.3522,"name":"clevercloud-postgresql-internal","tags":["scope:private"]},{"city":"Paris","country":"France","countryCode":"FR","displayName":"Private MongoDB cluster","id":"d7674e60-8178-43b9-aa80-342f613ec373","lat":48.8566,"lon":2.3522,"name":"yaakadev","tags":["scope:private"]},{"city":"Roubaix","country":"France","countryCode":"FR","id":"7602ecff-3b3a-42d4-84f4-6d382d4073d1","lat":50.6901,"lon":3.1613,"name":"rbxhds","tags":["certification:hds","for:applications","infra:ovh"]},{"city":"Sydney","country":"Australia","countryCode":"AU","id":"1a886ae1-1643-448b-a6b1-5891ecd74e82","lat":-33.8479,"lon":150.7915,"name":"syd","tags":["for:applications","infra:ovh"]},{"city":"New York","country":"United States of America","countryCode":"US","id":"96e8b92f-919e-4c94-91f8-71c90f2e200d","lat":40.7128,"lon":-74.006,"name":"nyc","tags":["infra:bso","for:applications"]},{"city":"North","country":"France","countryCode":"FR","id":"55336314-2f0e-42d5-87ac-bb7a1225350a","lat":50.7226113,"lon":2.5360331,"name":"fr-north-hds","tags":["infra:ovh","certification:hds"]},{"city":"Paris","country":"France","countryCode":"FR","displayName":"Private MySQL cluster","id":"a556b295-1d9c-46ca-bb19-342fc20c8451","lat":48.8566,"lon":2.3522,"name":"maj-digital","tags":["scope:private"]}];
  // return getAllZones()
  //   .then(sendToApi({ signal, cacheDelay: ONE_DAY }));
}