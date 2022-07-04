import {
  OrgSummary,
  CustomerSummary,
  Account,
  PaymentMode,
  InvoiceSummary,
} from ".";

export interface PaymentReceived {
  accountId: string;
  account: Account;
  amount: number;
  createdAt: Date;
  createdBy: string;
  customerId: string;
  customer: CustomerSummary;
  excess: number;
  modifiedAt: Date;
  modifiedBy: string;
  paymentDate: Date;
  paymentModeId: string;
  paymentMode: PaymentMode;
  reference: string;
  status: string;
  org: OrgSummary;
  paidInvoices: InvoiceSummary[];
  paidInvoicesIds: string[];
  payments: { [key: string]: number };
}
