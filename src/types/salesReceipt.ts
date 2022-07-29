import { Timestamp } from "firebase/firestore";
import {
  Account,
  CustomerSummary,
  Customer,
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
  customer: Customer;
  customerNotes: string;
  paymentMode: PaymentMode;
  receiptDate: Date;
  reference: string;
  selectedItems: SalesItem[];
  summary: SalesSummary;
}

export interface SalesReceiptFromDb
  extends Omit<SalesReceiptForm, "customer">,
    Meta {
  customer: CustomerSummary;
}

export interface SalesReceipt extends SalesReceiptFromDb {
  salesReceiptId: string;
}
