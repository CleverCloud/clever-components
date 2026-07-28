import { GetInvoiceCommand } from '@clevercloud/client/cc-api-commands/invoice/get-invoice-command.js';
import { GetInvoiceHtmlCommand } from '@clevercloud/client/cc-api-commands/invoice/get-invoice-html-command.js';
import { GetInvoiceUrl } from '@clevercloud/client/cc-api-commands/invoice/get-invoice-url.js';
import { ListInvoiceCommand } from '@clevercloud/client/cc-api-commands/invoice/list-invoice-command.js';
import { GetPriceSystemCommand } from '@clevercloud/client/cc-api-commands/price-system/get-price-system-command.js';
import { getCcApiClientWithOAuth } from './cc-api-client.js';

// FIXME: We're using `@typedef` instead of `@import` here due to a false positive from TS
// See: https://github.com/microsoft/TypeScript/issues/60908/
/**
 * @typedef {import('./send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../components/common.types.js').Invoice} Invoice
 * @typedef {import('@clevercloud/client/cc-api-commands/price-system/price-system.types.js').PriceSystem} PriceSystem
 */

const ONE_DAY = 1000 * 60 * 60 * 24;

/**
 * @param {object} options
 * @param {ApiConfig} options.apiConfig
 * @param {AbortSignal} options.signal
 * @param {string} options.ownerId
 * @param {string} options.invoiceNumber
 * @return {Promise<Invoice>}
 */
export async function fetchInvoice({ apiConfig, signal, ownerId, invoiceNumber }) {
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  const rawInvoice = await ccApiClient.send(new GetInvoiceCommand({ ownerId, invoiceNumber }), { signal });
  return formatInvoice(apiConfig, ownerId, rawInvoice);
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
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  return ccApiClient.send(new GetInvoiceHtmlCommand({ ownerId, invoiceNumber }), { signal });
}

/**
 * @param {object} options
 * @param {ApiConfig} options.apiConfig
 * @param {AbortSignal} options.signal
 * @param {string} options.ownerId
 * @return {Promise<Array<Invoice>>}
 */
export async function fetchAllInvoices({ apiConfig, signal, ownerId }) {
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  // We ask for all invoices by default for now
  const invoices = await ccApiClient.send(new ListInvoiceCommand({ ownerId, since: '2010-08-01T00:00:00.000Z' }), {
    signal,
  });
  return (
    invoices
      // The listing endpoint applies no status filter, so it hands us invoices written off by accounting. They are
      // frozen and unpayable: there is nothing a customer can do with one, so we leave them out of the list.
      .filter((rawInvoice) => rawInvoice.status !== 'LOSS')
      .map((rawInvoice) => formatInvoice(apiConfig, ownerId, rawInvoice))
  );
}

/**
 * `fetchPriceSystem` is used by the fully anonymous pricing simulator (`cc-pricing-estimation`,
 * `cc-pricing-product[mode="runtime"|"addon"]`, `cc-pricing-product-consumption`, all documented
 * "Requires auth: No"), which has no `ownerId` and relies on `currency` to filter prices.
 * `GetPriceSystemCommand` hits `GET /v4/billing/price-system` (no `ownerId`) in that case.
 *
 * @param {object} params
 * @param {ApiConfig} [params.apiConfig]
 * @param {AbortSignal} params.signal
 * @param {string} params.zoneId
 * @param {string} params.currency
 * @return {Promise<PriceSystem>}
 */
export async function fetchPriceSystem({ apiConfig, signal, zoneId, currency }) {
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  return ccApiClient.send(new GetPriceSystemCommand({ zone: zoneId, currency }), {
    signal,
    cache: { ttl: ONE_DAY },
  });
}

/**
 * @param {ApiConfig} apiConfig
 * @param {string} ownerId
 * @param {import('@clevercloud/client/cc-api-commands/invoice/invoice.types.js').Invoice
 *   | import('@clevercloud/client/cc-api-commands/invoice/invoice.types.js').InvoiceSummary} rawInvoice
 * @return {Invoice}
 */
function formatInvoice(apiConfig, ownerId, rawInvoice) {
  return {
    number: rawInvoice.invoiceNumber,
    emissionDate: rawInvoice.emittedAt,
    type: /** @type {Invoice['type']} */ (rawInvoice.kind) || 'INVOICE',
    status: rawInvoice.status,
    total: {
      amount: rawInvoice.totalTax.amount + rawInvoice.totalTaxExcluded.amount,
      currency: rawInvoice.totalTaxExcluded.currency,
    },
    downloadUrl: getDownloadUrl(apiConfig, ownerId, rawInvoice.invoiceNumber),
    paymentUrl: getPaymentUrl(ownerId, rawInvoice.invoiceNumber),
  };
}

/**
 * @param {ApiConfig} apiConfig
 * @param {string} ownerId
 * @param {string} invoiceNumber
 * @return {string}
 */
function getDownloadUrl(apiConfig, ownerId, invoiceNumber) {
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  const url = ccApiClient.getUrl(new GetInvoiceUrl({ ownerId, invoiceNumber, format: 'pdf' }));
  return url.toString();
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
