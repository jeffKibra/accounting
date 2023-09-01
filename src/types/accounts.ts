import { Timestamp } from 'firebase/firestore';

export type AccountType = {
  name: string;
  id: string;
  main: string;
};
export type Account = {
  name: string;
  accountId: string;
  accountType: AccountType;
};

export interface AccountFormData {
  name: string;
  accountType: AccountType;
  description: string;
}

export interface AccountFromDb extends AccountFormData {
  accountId: string;
  tags: string[];
  status: number;
  createdAt: Timestamp;
  modifiedAt: Timestamp;
  createdBy: string;
  modifiedBy: string;
}

export type AccountMapping = {
  accountId: string;
  current: number;
  incoming: number;
};
export type AccountsMapping = {
  uniqueAccounts: AccountMapping[];
  similarAccounts: AccountMapping[];
  updatedAccounts: AccountMapping[];
  deletedAccounts: AccountMapping[];
  newAccounts: AccountMapping[];
};
