import { Invoice } from "../common.types";

export type InvoiceListState = InvoiceListStateLoading | InvoiceListStateError | InvoiceListStateLoaded;

interface InvoiceListStateLoading {
  type: 'loading';
}

interface InvoiceListStateError {
  type: 'error';
}

interface InvoiceListStateLoaded {
  type: 'loaded';
  invoices: Array<Invoice>;
}
