import { Account } from './accounts';
import { IContactSummary } from './contacts';
import { TaxSummary } from './tax';

import { FieldValue } from 'firebase/firestore';

export interface IManualJournalEntry {
  account: Account;
  description: string;
  contact: IContactSummary | null;
  tax: TaxSummary | null;
  type: 'debit' | 'credit';
  amount: number;
}

export interface IManualJournalSummaryEntry {
  credit: number;
  debit: number;
}

export interface IManualJournalTaxEntry
  extends TaxSummary,
    IManualJournalSummaryEntry {}

export interface IAccountFromManualJournalEntries extends Account {
  balance: number;
  contacts: Record<string, IContactSummary>;
}

export interface IManualJournalFormSummary {
  subTotal: IManualJournalSummaryEntry;
  totalTax: IManualJournalSummaryEntry;
  taxes: Record<string, IManualJournalTaxEntry>;
  total: IManualJournalSummaryEntry;
  difference: number;
}

interface Meta {
  createdBy: string;
  createdAt: FieldValue;
  modifiedBy: string;
  modifiedAt: FieldValue;
  status: number;
  orgId: string;
}

export interface IManualJournalForm {
  entries: IManualJournalEntry[];
  summary: IManualJournalFormSummary;
  journalDate: Date;
  notes: string;
  reference: string;
}

export interface IManualJournalFromDb extends IManualJournalForm, Meta {}

export interface IManualJournal extends IManualJournalFromDb {
  id: string;
}
