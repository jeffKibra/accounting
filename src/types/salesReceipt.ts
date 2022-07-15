import { Timestamp } from "firebase/firestore";
import {
  Account,
  CustomerSummary,
  Customer,
  OrgSummary,
  PaymentMode,
  SalesItem,
  SalesItemFromForm,
  SalesSummary,
} from ".";

interface Meta {
  createdAt: Date | Timestamp;
  createdBy: string;
  modifiedAt: Date;
  modifiedBy: string;
  isSent: boolean;
  status: string;
  org: OrgSummary;
}

export interface SalesReceiptForm {
  account: Account;
  customer: Customer;
  customerNotes: string;
  paymentMode: PaymentMode;
  receiptDate: Date;
  reference: string;
  transactionType: string;
  selectedItems: SalesItemFromForm[];
  summary: SalesSummary;
}

export interface SalesReceiptFromDb
  extends Omit<SalesReceiptForm, "customer" | "selectedItems">,
    Meta {
  customer: CustomerSummary;
  selectedItems: SalesItem[];
}

export interface SalesReceipt extends SalesReceiptFromDb {
  salesReceiptId: string;
}
