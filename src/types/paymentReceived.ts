import { Timestamp } from 'firebase/firestore';
import {
  OrgSummary,
  IContactSummary,
  IContact,
  Account,
  PaymentMode,
  TransactionTypes,
  Invoice,
} from '.';

interface Meta {
  createdAt: Date | Timestamp;
  createdBy: string;
  modifiedAt: Date | Timestamp;
  modifiedBy: string;
  status: string;
  org: OrgSummary;
  transactionType: keyof Pick<TransactionTypes, 'customer_payment'>;
  paidInvoicesIds: string[];
  excess: number;
}

export interface PaymentReceivedForm {
  account: Account;
  amount: number;
  customer: IContact | IContactSummary;
  paymentDate: Date;
  paymentMode: PaymentMode;
  reference: string;
  payments: { [key: string]: number };
}

export interface PaymentReceivedFromDb
  extends Omit<PaymentReceivedForm, 'customer'>,
    Meta {
  customer: IContactSummary;
}

export interface PaymentReceived extends PaymentReceivedFromDb {
  paymentId: string;
}

export interface InvoicePaymentMapping {
  incoming: number;
  current: number;
  invoiceId: string;
}

export interface InvoicesPayments {
  [key: string]: number;
}

export interface PaymentWithInvoices extends PaymentReceived {
  invoices: Invoice[];
}
