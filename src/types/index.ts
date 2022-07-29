export type { OrgSummary, Org, OrgFormData, OrgFromDb } from "./org";
export type { UserProfile, LoginForm, SignupForm } from "./auth";
export type {
  Customer,
  CustomerSummary,
  CustomerFromDb,
  CustomerFormData,
  OpeningBalanceFormData,
} from "./customer";
export type {
  Entry,
  EntryWithStatus,
  EntryToChange,
  EntryToCreate,
  EntryToDelete,
  EntryToUpdate,
  GroupedEntries,
  FullEntry,
  EntryFromDb,
  MappedEntry,
  InvoicePaymentEntry,
} from "./entries";
export type {
  Account,
  AccountMapping,
  AccountsMapping,
  AccountType,
} from "./accounts";
export type { Tax, TaxForm, TaxFromDb } from "./tax";
export type {
  SalesItem,
  SalesSummary,
  SalesTax,
  GroupedItems,
  SalesAccountSummary,
} from "./sales";
export type { ExpenseItem } from "./expenseItem";
export type { PaymentMode } from "./paymentMode";
export type { PaymentTerm } from "./paymentTerm";
export type { Item, ItemFormData, ItemFromDb } from "./item";
export type {
  Invoice,
  InvoiceSummary,
  InvoiceFormData,
  InvoicePayments,
  InvoiceFromDb,
} from "./invoice";
export type {
  Vendor,
  VendorFromDb,
  VendorFormData,
  VendorSummary,
} from "./vendor";
export type {
  PaymentReceived,
  PaymentReceivedFromDb,
  PaymentReceivedForm,
  InvoicesPayments,
  InvoicePaymentMapping,
  PaymentWithInvoices,
} from "./paymentReceived";
export type { DailySummary } from "./dailySummary";
export type {
  Expense,
  ExpenseFormData,
  ExpenseFromDb,
  ExpenseSummary,
  ExpenseUpdateData,
} from "./expense";
export type {
  SalesReceipt,
  SalesReceiptForm,
  SalesReceiptFromDb,
} from "./salesReceipt";
export type {
  TransactionTypes,
  InvoiceTransactionTypes,
} from "./transactionTypes";
export type { DateDetails } from "./others";

export type { OneOfType } from "./oneOfType";

export type MakeAllFieldsOptional<T> = {
  [Property in keyof T]?: T[Property] extends Object
    ? MakeAllFieldsOptional<T[Property]>
    : T[Property];
};

export type MakeAllFieldsRequired<T> = {
  [Property in keyof T]-?: T[Property];
};

//export redux rootState
export type { RootState } from "../store/index";
