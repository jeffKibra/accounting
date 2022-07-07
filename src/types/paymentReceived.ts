import { Timestamp } from "firebase/firestore";
import {
  OrgSummary,
  CustomerSummary,
  Customer,
  Account,
  PaymentMode,
  InvoiceSummary,
  Invoice,
} from ".";

interface Extras {
  paidInvoicesIds: string[];
  excess: number;
}

interface Meta extends Extras {
  createdAt: Date | Timestamp;
  createdBy: string;
  modifiedAt: Date | Timestamp;
  modifiedBy: string;
  status: string;
  org: OrgSummary;
}

export interface PaymentReceivedForm {
  accountId: string;
  account: Account;
  amount: number;
  customerId: string;
  customer: Customer;
  paymentDate: Date;
  paymentModeId: string;
  paymentMode: PaymentMode;
  reference: string;
  paidInvoices: Invoice[];
  payments: { [key: string]: number };
}

export interface PaymentReceivedDetails
  extends Omit<PaymentReceivedForm, "paidInvoices" | "customer">,
    Extras {
  paymentId: string;
  paidInvoices: InvoiceSummary[];
  customer: CustomerSummary;
}

export interface PaymentReceivedFormWithId extends PaymentReceivedForm {
  paymentId: string;
}

export interface PaymentReceivedFromDb
  extends Omit<PaymentReceivedForm, "paidInvoices" | "customer">,
    Meta {
  paidInvoices: InvoiceSummary[];
  customer: CustomerSummary;
}

export interface PaymentReceivedUpdate
  extends PaymentReceivedForm,
    Partial<Meta> {
  paymentId: string;
}

export interface PaymentReceived extends PaymentReceivedFromDb {
  paymentId: string;
}

export interface InvoicePaymentMapping {
  incoming: number;
  current: number;
  invoiceId: string;
}

export interface PaymentsToInvoices {
  [key: string]: number;
}
