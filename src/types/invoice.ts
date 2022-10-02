import {
  OrgSummary,
  CustomerSummary,
  PaymentTerm,
  SalesItem,
  SalesSummary,
  InvoiceTransactionTypes,
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

export interface InvoiceFormData {
  customer: CustomerSummary;
  customerNotes: string;
  dueDate: Date;
  invoiceDate: Date;
  orderNumber: string;
  paymentTerm: PaymentTerm;
  subject: string;
  selectedItems: SalesItem[];
  summary: SalesSummary;
}

export interface InvoiceFromDb extends InvoiceFormData, Meta {}

export interface Invoice extends InvoiceFromDb {
  invoiceId: string;
}

export interface InvoiceSummary {
  balance: number;
  dueDate: Date;
  invoiceDate: Date;
  invoiceId: string;
  status: number;
  transactionType: string;
  summary: SalesSummary;
}
