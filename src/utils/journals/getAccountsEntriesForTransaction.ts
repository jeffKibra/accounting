import { getAccountEntryForTransaction } from ".";

import { AccountMapping, MappedEntry, TransactionTypes } from "../../types";

export default async function getAccountsEntriesForTransaction(
  orgId: string,
  transactionId: string,
  transactionType: keyof TransactionTypes,
  incomeAccounts: AccountMapping[]
) {
  console.log({ incomeAccounts });

  const entries: MappedEntry[] = await Promise.all(
    incomeAccounts.map(async (account) => {
      const { accountId } = account;
      const entryData = await getAccountEntryForTransaction(
        orgId,
        accountId,
        transactionId,
        transactionType
      );

      return {
        ...account,
        ...entryData,
      };
    })
  );

  return entries;
}
