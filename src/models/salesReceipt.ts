import {
  Account,
  CustomerSummary,
  OrgSummary,
  PaymentMode,
  SalesItem,
  SalesSummary,
} from ".";

export interface SalesReceipt {
  accountId: string;
  account: Account;
  createdAt: Date;
  createdBy: string;
  customerId: string;
  customer: CustomerSummary;
  customerNotes: string;
  isSent: boolean;
  modifiedAt: Date;
  modifiedBy: string;
  paymentModeId: string;
  paymentMode: PaymentMode;
  receiptDate: Date;
  reference: string;
  status: string;
  transactionType: string;
  org: OrgSummary;
  selectedItems: SalesItem[];
  summary: SalesSummary;
}
