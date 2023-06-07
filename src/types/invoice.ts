import {
  OrgSummary,
  // IContactSummary,
  PaymentTerm,
  // SalesItem,
  InvoiceTransactionTypes,
  IBookingSaleForm,
} from '.';
import { Timestamp } from 'firebase/firestore';

// export interface InvoicePayment {
//   account: Account;
//   amount?: number;
//   customerId: string;
//   excess: number;
//   paidInvoicesIds: string[];
//   paymentAmount: number;
//   paymentDate: Date;
//   paymentId: string;
//   paymentMode: PaymentMode;
//   payments: { [key: string]: number };
//   reference: string;
//   status: string;
// }

export interface InvoicePayments {
  [key: string]: number;
}

interface Meta {
  transactionType: keyof InvoiceTransactionTypes;
  balance: number;
  isSent: boolean;
  isOverdue: boolean;
  paymentsCount: number;
  paymentsIds: string[];
  paymentsReceived: InvoicePayments;
  status: number;
  org: OrgSummary;
  createdAt: Date | Timestamp;
  createdBy: string;
  modifiedAt: Date | Timestamp;
  modifiedBy: string;
}

export interface InvoiceFormData extends IBookingSaleForm {
  // customerNotes: string;
  dueDate: Date;
  // orderNumber: string;
  paymentTerm: PaymentTerm;
  // subject: string;
}

export interface InvoiceFromDb extends InvoiceFormData, Meta {}

export interface Invoice extends InvoiceFromDb {
  invoiceId: string;
}

//eslint-disable-next-line
export interface InvoiceSummary
  extends Pick<
    Invoice,
    | 'balance'
    | 'dueDate'
    | 'saleDate'
    | 'invoiceId'
    | 'status'
    | 'transactionType'
    | 'bookingTotal'
    | 'transferAmount'
    | 'total'
  > {}
