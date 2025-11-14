/**
 * @import { Invoice, InvoiceStatusType, InvoiceType } from '../../components/common.types.js'
 * @typedef {'01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12'} MonthNumberAsString
 */

/**
 * @param {string} year
 * @param {MonthNumberAsString} month
 * @param {number} amount
 * @param {InvoiceStatusType} status
 * @param {InvoiceType} [type]
 * @return {Invoice}
 */
export function createInvoice (year, month, amount, status, type = 'INVOICE') {
  const emissionDate = `${year}-${month}-01`;
  const number = `${year + month}01-${String((Math.ceil(amount * 100)) % 1000).padStart(4, '0')}`;
  const downloadUrl = '/download/' + number;
  const paymentUrl = '/pay/' + number;
  return { emissionDate, number, type, status, total: { currency: 'EUR', amount }, downloadUrl, paymentUrl, invoiceHtml: '' };
}

/**
 * @param {string} year
 * @return {Invoice[]}
 */
export const pendingInvoices = (year) => [
  createInvoice(year, '01', 17.79, 'WONTPAY'),
  createInvoice(year, '02', 29.24, 'PENDING'),
  createInvoice(year, '03', 73.34, 'PENDING'),
  createInvoice(year, '04', 71.96, 'PENDING'),
  createInvoice(year, '05', 662.95, 'PENDING'),
  createInvoice(year, '06', 100.42, 'PENDING'),
  createInvoice(year, '07', 1894.88, 'PENDING'),
  createInvoice(year, '08', 111971.46, 'PENDING'),
  createInvoice(year, '09', 99.14, 'PENDING'),
  createInvoice(year, '10', 2261.81, 'PAYMENTHELD'),
  createInvoice(year, '11', 6218.31, 'PENDING'),
  createInvoice(year, '12', 11487.02, 'PENDING'),
];

/**
 * @param {string} year
 * @return {Invoice[]}
 */
export const processingInvoices = (year) => [
  createInvoice(year, '11', 172.79, 'PROCESSING'),
  createInvoice(year, '12', 2287.02, 'PROCESSING'),
];

/**
 * @param {string} year
 * @return {Invoice[]}
 */
export const processedInvoices = (year) => [
  createInvoice(year, '01', 1782.79, 'PAID'),
  createInvoice(year, '02', 1129.24, 'PAID'),
  createInvoice(year, '03', 4273.34, 'PAID'),
  createInvoice(year, '04', 2171.96, 'CANCELED'),
  createInvoice(year, '05', 3662.95, 'PAID'),
  createInvoice(year, '06', 100.42, 'PAID'),
  createInvoice(year, '07', 1894.88, 'PAID'),
  createInvoice(year, '08', 1971.46, 'REFUNDED'),
  createInvoice(year, '09', 1699.14, 'PAID'),
  createInvoice(year, '10', 2261.81, 'CANCELED'),
  createInvoice(year, '11', 618.31, 'PAID'),
  createInvoice(year, '12', 1487.02, 'PAID'),
];

/** @type {Invoice[]} */
export const fullInvoicesExample = [
  ...pendingInvoices('2020').slice(0, 4),
  ...processingInvoices('2020'),
  ...processedInvoices('2019'),
  ...processedInvoices('2020').slice(2, 10),
  ...processedInvoices('2018').slice(2, 10),
  ...processedInvoices('2017').slice(3, 10),
  ...processedInvoices('2016').slice(1, 9),
  ...processedInvoices('2015').slice(1, 9),
];
