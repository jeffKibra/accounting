import { Timestamp } from 'firebase/firestore';
import {
  PaymentMode,
  Account,
  ExpenseItem,
  IContactSummary,
  OrgSummary,
  TransactionTypes,
} from '.';

export interface ExpenseSummary {
  expenseTaxes: [];
  subTotal: number;
  totalAmount: number;
  totalTax: number;
}

export interface ExpenseFormData {
  paymentMode: PaymentMode;
  reference: string;
  taxType: string;
  vendor?: IContactSummary;
  paymentAccount: Account;
  items: ExpenseItem[];
  expenseDate: Date | Timestamp;
  summary: ExpenseSummary;
}

interface Meta {
  createdAt: Date | Timestamp;
  createdBy: string;
  modifiedAt: Date | Timestamp;
  modifiedBy: string;
  status: string;
  org: OrgSummary;
  transactionType: keyof Pick<TransactionTypes, 'expense'>;
}

export interface ExpenseFromDb extends Omit<ExpenseFormData, 'vendor'>, Meta {
  vendor?: IContactSummary;
}

export interface ExpenseUpdateData
  extends Omit<ExpenseFromDb, 'org' | 'createdAt' | 'createdBy'> {}

export interface Expense extends ExpenseFromDb {
  expenseId: string;
}
