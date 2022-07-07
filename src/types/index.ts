export type { OrgSummary, Org } from "./org";
export type { UserProfile } from "./userProfile";
export type {
  Customer,
  CustomerSummary,
  CustomerFromDb,
  CustomerToUpdate,
  CustomerFormData,
  OpeningBalanceFormData,
  CustomerFormDataWithId,
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
export type { Tax } from "./tax";
export type {
  SalesItem,
  SalesSummary,
  SalesTax,
  SalesItemFromForm,
} from "./sales";
export type { ExpenseItem } from "./expenseItem";
export type { PaymentMode } from "./paymentMode";
export type { PaymentTerm } from "./paymentTerm";
export type { Item } from "./item";
export type {
  Invoice,
  InvoiceSummary,
  InvoiceFormData,
  InvoicePayment,
  InvoicePayments,
  InvoiceFromDb,
  InvoiceFormWithId,
  InvoiceUpdateData,
} from "./invoice";
export type {
  Vendor,
  VendorFromDb,
  VendorFormData,
  VendorSummary,
} from "./vendor";
export type {
  PaymentReceived,
  PaymentReceivedFormWithId,
  PaymentReceivedFromDb,
  PaymentReceivedUpdate,
  PaymentReceivedForm,
  PaymentsToInvoices,
  InvoicePaymentMapping,
  PaymentReceivedDetails,
} from "./paymentReceived";
export type { DailySummary } from "./dailySummary";
export type {
  Expense,
  ExpenseFormData,
  ExpenseFromDb,
  ExpenseSummary,
  ExpenseUpdateData,
} from "./expense";
export type { DateDetails } from "./others";

export type MakeAllFieldsOptional<T> = {
  [Property in keyof T]?: T[Property] extends Object
    ? MakeAllFieldsOptional<T[Property]>
    : T[Property];
};

export type MakeAllFieldsRequired<T> = {
  [Property in keyof T]-?: T[Property];
};
