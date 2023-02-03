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

// TODO: move to clever-client
// Tmp Grafana API calls
/**
 * GET /v4/saas/grafana/{id}
 * @param {Object} params
 * @param {String} params.id
 */
export function getGrafanaOrganisation (params) {
  return Promise.resolve({
    method: 'get',
    url: `/v4/saas/grafana/${params.id}`,
    headers: { Accept: 'application/json' },
  });
}
/**
 * POST /v4/saas/grafana/{id}
 * @param {Object} params
 * @param {String} params.id
 */
export function createGrafanaOrganisation (params) {
  return Promise.resolve({
    method: 'post',
    url: `/v4/saas/grafana/${params.id}`,
    headers: { Accept: 'application/json' },
  });
}
/**
 * DELETE /v4/saas/grafana/{id}
 * @param {Object} params
 * @param {String} params.id
 */
export function deleteGrafanaOrganisation (params) {
  return Promise.resolve({
    method: 'delete',
    url: `/v4/saas/grafana/${params.id}`,
    headers: { Accept: 'application/json' },
  });
}
/**
 * POST /v4/saas/grafana/{id}/reset
 * @param {Object} params
 * @param {String} params.id
 */
export function resetGrafanaOrganisation (params) {
  return Promise.resolve({
    method: 'post',
    url: `/v4/saas/grafana/${params.id}/reset`,
    headers: { Accept: 'application/json' },
  });
}

export async function fetchAllZones ({ signal }) {
  return getAllZones()
    .then(sendToApi({ signal, cacheDelay: ONE_DAY }));
}

// TODO: move this to clever client
export function getAppMetrics (params) {
  return Promise.resolve({
    method: 'get',
    url: `/v4/metrics/organisations/${params.id}/resources/${params.appId}/metrics?interval="P1D"&span="PT1H"&only=cpu&only=mem`,
    headers: { Accept: 'application/json' },
  });
}
