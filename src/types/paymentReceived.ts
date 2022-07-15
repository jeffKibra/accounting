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
  account: Account;
  amount: number;
  customer: Customer;
  paymentDate: Date;
  paymentMode: PaymentMode;
  reference: string;
  paidInvoices: Invoice[];
  payments: { [key: string]: number };
}

// export interface PaymentReceivedDetails
//   extends Omit<PaymentReceivedForm, "paidInvoices" | "customer">,
//     Extras {
//   paymentId: string;
//   paidInvoices: InvoiceSummary[];
//   customer: CustomerSummary;
// }

export interface PaymentReceivedFromDb
  extends Omit<PaymentReceivedForm, "paidInvoices" | "customer">,
    Meta {
  paidInvoices: InvoiceSummary[];
  customer: CustomerSummary;
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
