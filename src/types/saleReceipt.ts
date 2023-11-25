import { Timestamp } from 'firebase/firestore';
import {
  IAccountSummary,
  IContactSummary,
  IOrgSummary,
  PaymentMode,
  ISaleItem,
  ISaleSummary,
  TransactionTypes,
} from '.';

interface Meta {
  createdAt: Date | Timestamp;
  createdBy: string;
  modifiedAt: Date;
  modifiedBy: string;
  isSent: boolean;
  status: string;
  org: IOrgSummary;
  transactionType: keyof Pick<TransactionTypes, 'SALE_RECEIPT'>;
}

export interface SaleReceiptForm {
  account: IAccountSummary;
  customer: IContactSummary;
  customerNotes: string;
  paymentMode: PaymentMode;
  receiptDate: Date;
  reference: string;
  selectedItems: ISaleItem[];
  summary: ISaleSummary;
}

export interface SaleReceipt extends SaleReceiptForm, Meta {
  saleReceiptId: string;
}

export interface SaleReceiptFromDb extends Omit<SaleReceipt, 'saleReceiptId'> {
  saleReceiptId?: string;
}
