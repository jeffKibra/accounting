import { Timestamp } from "firebase/firestore";
import { Account, DateDetails, AccountMapping } from ".";

export interface Entry {
  entryId: string;
  account: Account;
  debit: number;
  credit: number;
}

export interface GroupedEntries extends Account {
  entries: Entry[];
}

export interface MappedEntry extends Entry, AccountMapping {}

type TransactionDetails = {
  [key: string]: unknown;
};

export interface EntryWithStatus extends Entry {
  status: string;
}

export interface EntryToChange {
  amount: number;
  prevAccount: Account;
  prevEntry: Entry;
  transactionType?: string;
  transactionId?: string;
  reference?: string;
  transactionDetails?: TransactionDetails;
}

export interface EntryToCreate {
  amount: number;
  transactionType: string;
  transactionId: string;
  reference: string;
  account: Account;
  transactionDetails: TransactionDetails;
}

export interface EntryToDelete {
  entryId: string;
  account: Account;
  debit: number;
  credit: number;
}

export interface EntryToUpdate extends Partial<EntryToCreate> {
  entryId: string;
  amount: number;
  account: Account;
  debit: number;
  credit: number;
}

export interface EntryFromDb extends Omit<Entry, "entryId"> {
  amount: number;
  amountState: string;
  createdAt: Date | Timestamp;
  createdBy: string;
  date: DateDetails;
  modifiedAt: Date | Timestamp;
  modifiedBy: string;
  reference: string;
  status: string;
  transactionId: string;
  transactionType: string;
  transactionDetails: TransactionDetails;
}

export interface FullEntry extends EntryFromDb {
  entryId: string;
}

export interface InvoicePaymentEntry {
  current: number;
  incoming: number;
  invoiceId: string;
  entry: Entry;
}