import { Timestamp } from "firebase/firestore";
import {
  PaymentMode,
  Account,
  ExpenseItem,
  Vendor,
  VendorSummary,
  OrgSummary,
  TransactionTypes,
} from ".";

export interface ExpenseSummary {
  expenseTaxes: [];
  subTotal: number;
  totalAmount: number;
  totalTaxes: number;
}

export interface ExpenseFormData {
  paymentMode: PaymentMode;
  reference: string;
  taxType: string;
  vendor?: Vendor;
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
  transactionType: keyof Pick<TransactionTypes, "expense">;
}

export interface ExpenseFromDb extends Omit<ExpenseFormData, "vendor">, Meta {
  vendor?: VendorSummary;
}

export interface ExpenseUpdateData
  extends Omit<ExpenseFromDb, "org" | "createdAt" | "createdBy"> {}

export interface Expense extends ExpenseFromDb {
  expenseId: string;
}
