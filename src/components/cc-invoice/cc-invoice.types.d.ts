export type InvoiceState = InvoiceStateLoading | InvoiceStateError | InvoiceStateLoaded;

interface InvoiceStateLoading {
  type: 'loading';
  number?: string;
}

interface InvoiceStateError {
  type: 'error';
  number: string;
}

interface InvoiceStateLoaded {
  type: 'loaded';
  number: string;
  downloadUrl: string;
  emissionDate: string;
  amount: number;
  currency: string; // ISO 4217 currency code
  invoiceHtml: string;
}
