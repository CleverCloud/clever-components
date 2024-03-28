import { Invoice } from '../common.types.js';

export type InvoiceTableState = InvoiceTableStateLoaded | InvoiceTableStateLoading;

export interface InvoiceTableStateLoaded {
  type: 'loaded';
  invoices: Invoice[];
}

export interface InvoiceTableStateLoading {
  type: 'loading';
}
