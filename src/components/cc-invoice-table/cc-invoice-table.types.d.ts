import { Invoice } from "../common.types";

export type InvoiceTableState = InvoiceTableStateLoaded | InvoiceTableStateLoading;

interface InvoiceTableStateLoaded {
  type: 'loaded';
  invoices: Invoice[];
}

interface InvoiceTableStateLoading {
  type: 'loading';
}

export interface SkeletonInvoice {
  emissionDate: '2020-01-01' | '2020-02-01' | '2020-03-01';
  number: '????????????';
  type: 'INVOICE'; 
  status: 'PENDING';
  total: { 
    currency: 'EUR';
    amount: 10.00 | 200.00 | 3000.00;
  };
  downloadUrl: null;
  paymentUrl: null;
}
