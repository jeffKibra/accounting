import { Timestamp } from "firebase/firestore";
import {
  Account,
  CustomerSummary,
  OrgSummary,
  PaymentMode,
  SalesItem,
  SalesSummary,
  TransactionTypes,
} from ".";

interface Meta {
  createdAt: Date | Timestamp;
  createdBy: string;
  modifiedAt: Date;
  modifiedBy: string;
  isSent: boolean;
  status: string;
  org: OrgSummary;
  transactionType: keyof Pick<TransactionTypes, "sales_receipt">;
}

export interface SalesReceiptForm {
  account: Account;
  customer: CustomerSummary;
  customerNotes: string;
  paymentMode: PaymentMode;
  receiptDate: Date;
  reference: string;
  selectedItems: SalesItem[];
  summary: SalesSummary;
}

export interface SalesReceipt extends SalesReceiptForm, Meta {
  salesReceiptId: string;
}

export interface SalesReceiptFromDb
  extends Omit<SalesReceipt, "salesReceiptId"> {
  salesReceiptId?: string;
}
