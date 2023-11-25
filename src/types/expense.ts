import { Timestamp } from 'firebase/firestore';
import {
  PaymentMode,
  IAccountSummary,
  ExpenseItem,
  IContactSummary,
  IOrgSummary,
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
  paymentAccount: IAccountSummary;
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
  org: IOrgSummary;
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
