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
