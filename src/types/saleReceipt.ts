import { Timestamp } from 'firebase/firestore';
import {
  Account,
  IContactSummary,
  OrgSummary,
  PaymentMode,
  SalesItem,
  SalesSummary,
  TransactionTypes,
} from '.';

interface Meta {
  createdAt: Date | Timestamp;
  createdBy: string;
  modifiedAt: Date;
  modifiedBy: string;
  isSent: boolean;
  status: string;
  org: OrgSummary;
  transactionType: keyof Pick<TransactionTypes, 'SALE_RECEIPT'>;
}

export interface SaleReceiptForm {
  account: Account;
  customer: IContactSummary;
  customerNotes: string;
  paymentMode: PaymentMode;
  receiptDate: Date;
  reference: string;
  selectedItems: SalesItem[];
  summary: SalesSummary;
}

export interface SaleReceipt extends SaleReceiptForm, Meta {
  saleReceiptId: string;
}

export interface SaleReceiptFromDb extends Omit<SaleReceipt, 'saleReceiptId'> {
  saleReceiptId?: string;
}
