// export * from './gql';
export * from './auth';
// export * from './monthlyBookings';

// export * from './queries';
// export * from './searchResults';
// export * from './searchVehiclesResults';
// export * from './searchBookingsResults';
// export * from './search';
// export * from './sortBy';

export * from './vehicle';
export * from './booking';
// export * from './pagination';

export * from './sale';
export * from './invoice';
export * from './paymentReceived';
export * from './contact';
export * from './account';
export * from './address';
export * from './org';
export * from './tax';
export * from './journalEntry';

//
//
//
export type { OrgSummary, Org, OrgFormData, OrgFromDb } from './org';
export type { UserProfile, LoginForm, SignupForm } from './auth';
// export type {
//   Customer,
//   CustomerSummary,
//   CustomerFromDb,
//   CustomerFormData,
// } from './customer';
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
} from './journalEntry';

export type { ExpenseItem } from './expenseItem';
export type { PaymentMode } from './paymentMode';
export type { PaymentTerm } from './paymentTerm';
export type { Item, ItemFormData, ItemFromDb, ItemType } from './item';
export type { ICarModel, ICarModelForm, ICarModels } from './carModel';

// export type {
//   Vendor,
//   VendorFromDb,
//   VendorFormData,
//   VendorSummary,
// } from './vendor';

export type { DailySummary } from './dailySummary';
export type {
  Expense,
  ExpenseFormData,
  ExpenseFromDb,
  ExpenseSummary,
  ExpenseUpdateData,
} from './expense';
export type {
  SaleReceipt,
  SaleReceiptForm,
  SaleReceiptFromDb,
} from './saleReceipt';
export type {
  TransactionTypes,
  InvoiceTransactionTypes,
  SaleTransactionTypes,
  CustomerOpeningBalanceTransactionType,
} from './transactionTypes';
export type {
  CustomerOpeningBalanceForm,
  CustomerOpeningBalance,
  CustomerOpeningBalanceFromDb,
} from './customerOpeningBalance';
export type { DateDetails } from './others';


export type {
  IManualJournalEntry,
  IManualJournalForm,
  IManualJournalFromDb,
  IManualJournal,
} from './manualJournal';

export type { OneOfType } from './oneOfType';

export type MakeAllFieldsOptional<T> = {
  [Property in keyof T]?: T[Property] extends Object
    ? MakeAllFieldsOptional<T[Property]>
    : T[Property];
};

export type MakeAllFieldsRequired<T> = {
  [Property in keyof T]-?: T[Property];
};

//export redux rootState
export type { RootState } from '../store/index';
