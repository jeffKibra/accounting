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
} from './entries';
export type {
  Account,
  AccountMapping,
  AccountsMapping,
  AccountType,
  AccountFormData,
  AccountFromDb,
} from './accounts';
export type { Tax, TaxForm, TaxFromDb, TaxSummary } from './tax';
export type {
  SalesItem,
  SaleItem,
  SaleSummary,
  SelectedItem,
  SalesSummary,
  SalesTax,
  GroupedItems,
  SalesAccountSummary,
  ISaleItemFormData,
} from './sales';
export type { ExpenseItem } from './expenseItem';
export type { PaymentMode } from './paymentMode';
export type { PaymentTerm } from './paymentTerm';
export type { Item, ItemFormData, ItemFromDb, ItemType } from './item';
export type { ICarModel, ICarModelForm, ICarModels } from './carModels';
export type {
  IBookingAdjustmentData,
  IBookingDateRange,
  IBookingItem,
  IBookingForm,
  IMonthlyBookingUpdateData,
  IMonthlyBookings,
  IItemBookings,
  IMonthBookings,
  IGetMonthBookingSuccessPayload,
  IBooking,
  IBookingDownPayment,
  IBookingFromDb,
  IBookingPayments,
} from './bookings';
export type {
  Invoice,
  InvoiceSummary,
  InvoiceFormData,
  InvoicePayments,
  InvoiceFromDb,
} from './invoice';
// export type {
//   Vendor,
//   VendorFromDb,
//   VendorFormData,
//   VendorSummary,
// } from './vendor';
export type {
  PaymentReceived,
  PaymentReceivedFromDb,
  PaymentReceivedForm,
  InvoicesPayments,
  InvoicePaymentMapping,
  PaymentWithInvoices,
} from './paymentReceived';
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
  IContactSummary,
  IContact,
  IContactForm,
  IContactFromDb,
} from './contacts';
export type {
  IManualJournalEntry,
  IManualJournalForm,
  IManualJournalFromDb,
  IManualJournal,
} from './manualJournals';

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
