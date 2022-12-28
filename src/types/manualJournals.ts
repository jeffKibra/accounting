import { Account } from './accounts';
import { IContactSummary } from './contacts';
import { TaxSummary } from './tax';

export interface IManualJournalEntry {
  account: Account;
  description: string;
  contact: IContactSummary | null;
  tax: TaxSummary | null;
  type: 'debit' | 'credit';
  amount: number;
}
