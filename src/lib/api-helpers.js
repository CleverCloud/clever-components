// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getApp } from '@clevercloud/client/esm/api/v2/application.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllInvoices, getInvoice } from '@clevercloud/client/esm/api/v4/billing.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { addOauthHeader } from '@clevercloud/client/esm/oauth.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { pickNonNull } from '@clevercloud/client/esm/pick-non-null.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { sendToApi } from './send-to-api.js';
import { asyncMap } from './utils.js';

/**
 * @typedef {import('./send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../components/common.types.js').Invoice} Invoice
 * @typedef {import('./product.js').PriceSystem} PriceSystem
 */

/**
 * @param {object} options
 * @param {ApiConfig} options.apiConfig
 * @param {AbortSignal} options.signal
 * @param {string} options.ownerId
 * @param {string} options.appId
 * @return {Promise<{name: string}>}
 */
export function fetchApp({ apiConfig, signal, ownerId, appId }) {
  return getApp({ id: ownerId, appId }).then(sendToApi({ apiConfig, signal }));
}

/**
 * @param {object} options
 * @param {ApiConfig} options.apiConfig
 * @param {AbortSignal} options.signal
 * @param {string} options.ownerId
 * @param {string} options.invoiceNumber
 * @return {Promise<Invoice>}
 */
export async function fetchInvoice({ apiConfig, signal, ownerId, invoiceNumber }) {
  return getInvoice({ id: ownerId, invoiceNumber, type: '' })
    .then(sendToApi({ apiConfig, signal }))
    .then(/** @param {{[p: string]: any}} invoice*/ (invoice) => formatInvoice(apiConfig, ownerId, invoice));
}

/**
 * @param {object} options
 * @param {ApiConfig} options.apiConfig
 * @param {AbortSignal} options.signal
 * @param {string} options.ownerId
 * @param {string} options.invoiceNumber
 * @return {Promise<string>}
 */
export async function fetchInvoiceHtml({ apiConfig, signal, ownerId, invoiceNumber }) {
  return getInvoice({ id: ownerId, invoiceNumber, type: '.html' }).then(sendToApi({ apiConfig, signal }));
}

/**
 * @param {object} options
 * @param {ApiConfig} options.apiConfig
 * @param {AbortSignal} options.signal
 * @param {string} options.ownerId
 * @return {Promise<Array<Invoice>>}
 */
export async function fetchAllInvoices({ apiConfig, signal, ownerId }) {
  // We ask for all invoices by default for now
  return getAllInvoices({ id: ownerId, since: '2010-08-01T00:00:00.000Z' })
    .then(sendToApi({ apiConfig, signal }))
    .then(
      /** @param {Array<{[p: string]: any}>} invoices */ (invoices) => {
        return asyncMap(invoices, async (i) => formatInvoice(apiConfig, ownerId, i));
      },
    );
}

/**
 *
 * @param {ApiConfig} apiConfig
 * @param {string} ownerId
 * @param {{[p: string]: any}} rawInvoice
 * @return {Promise<Invoice>}
 */
async function formatInvoice(apiConfig, ownerId, rawInvoice) {
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

/**
 * @param {ApiConfig} apiConfig
 * @param {string} ownerId
 * @param {string} invoiceNumber
 * @return {Promise<string>}
 */
function getDownloadUrl(apiConfig, ownerId, invoiceNumber) {
  return getInvoice({ id: ownerId, invoiceNumber, type: '.pdf' })
    .then(prefixUrl(apiConfig.API_HOST))
    .then(addOauthHeader(apiConfig))
    .then(
      /** @param {{url: string, headers: {Authorization: string}}} requestParams */ (requestParams) => {
        const url = new URL(requestParams.url);
        url.searchParams.set('authorization', btoa(requestParams.headers.Authorization));
        return url.toString();
      },
    );
}

/**
 * @param {string} ownerId
 * @param {string} invoiceNumber
 * @return {string}
 */
function getPaymentUrl(ownerId, invoiceNumber) {
  return ownerId == null || ownerId.startsWith('user_')
    ? `/users/me/invoices/${invoiceNumber}`
    : `/organisations/${ownerId}/invoices/${invoiceNumber}`;
}

// TODO: move to clever-client
/**
 * GET /v4/billing/price-system
 * @param {object} params
 * @param {String} params.zone_id
 * @param {String} params.currency
 */
export function getPriceSystem(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/billing/price-system`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['zone_id', 'currency']),
    // no body
  });
}

/**
 *
 * @param {object} params
 * @param {ApiConfig} [params.apiConfig]
 * @param {AbortSignal} params.signal
 * @param {string} params.zoneId
 * @param {string} params.currency
 * @return {Promise<PriceSystem>}
 */
export function fetchPriceSystem({ apiConfig, signal, zoneId, currency }) {
  // eslint-disable-next-line camelcase
  return getPriceSystem({ zone_id: zoneId, currency }).then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }));
}

// TODO: move to clever-client
// Tmp Grafana API calls
/**
 * GET /v4/saas/grafana/{id}
 * @param {object} params
 * @param {string} params.id
 */
export function getGrafanaOrganisation(params) {
  return Promise.resolve({
    method: 'get',
    url: `/v4/saas/grafana/${params.id}`,
    headers: { Accept: 'application/json' },
  });
}

/**
 * POST /v4/saas/grafana/{id}
 * @param {object} params
 * @param {string} params.id
 */
export function createGrafanaOrganisation(params) {
  return Promise.resolve({
    method: 'post',
    url: `/v4/saas/grafana/${params.id}`,
    headers: { Accept: 'application/json' },
  });
}

/**
 * DELETE /v4/saas/grafana/{id}
 * @param {Object} params
 * @param {string} params.id
 */
export function deleteGrafanaOrganisation(params) {
  return Promise.resolve({
    method: 'delete',
    url: `/v4/saas/grafana/${params.id}`,
    headers: { Accept: 'application/json' },
  });
}

/**
 * POST /v4/saas/grafana/{id}/reset
 * @param {object} params
 * @param {string} params.id
 */
export function resetGrafanaOrganisation(params) {
  return Promise.resolve({
    method: 'post',
    url: `/v4/saas/grafana/${params.id}/reset`,
    headers: { Accept: 'application/json' },
  });
}

// TODO: move this to clever client
/**
 *
 * @param {object} params
 * @param {string} params.id
 * @param {string} params.appId
 * @return {Promise<{headers: {Accept: string}, method: string, url: string}>}
 */
export function getAppMetrics({ id, appId }) {
  return Promise.resolve({
    method: 'get',
    // TODO: Handle query params properly. (https://github.com/CleverCloud/clever-client.js/issues/76)
    url: `/v4/stats/organisations/${id}/resources/${appId}/metrics?interval=P1D&span=PT1H&only=cpu&only=mem`,
    headers: { Accept: 'application/json' },
  });
}
