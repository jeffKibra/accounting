import { Account } from "./accounts";

export interface Entry {
  entryId: string;
  account: Account;
  debit: number;
  credit: number;
}

export interface EntryWithStatus extends Entry {
  status: string;
}

export interface EntryToChange {
  amount: number;
  transactionType: string;
  transactionId: string;
  reference: string;
  prevAccount: Account;
  prevEntry: Entry;
  transactionDetails: Object;
}

export interface EntryToCreate {
  amount: number;
  transactionType: string;
  transactionId: string;
  reference: string;
  account: Account;
  transactionDetails: "";
}

export interface EntryToDelete {
  entryId: string;
  account: Account;
  debit: number;
  credit: number;
}

export interface EntryToUpdate {
  entryId: string;
  amount: number;
  account: Account;
  debit: number;
  credit: number;
}

export interface GroupedEntries extends Account {
  entries: Entry[];
}
