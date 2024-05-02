import { Invoice } from '../common.types.js';

export type InvoiceListState = InvoiceListStateLoading | InvoiceListStateError | InvoiceListStateLoaded;

export interface InvoiceListStateLoading {
  type: 'loading';
}

export interface InvoiceListStateError {
  type: 'error';
}

export interface InvoiceListStateLoaded {
  type: 'loaded';
  invoices: Array<Invoice>;
}
