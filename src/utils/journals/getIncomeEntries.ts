import { getAccountTransactionEntry } from ".";

/**
 *
 * @typedef {import('../accounts').accountMapping} accountMapping
 * @typedef {import('.').entryData} entryData
 */
/**
 *
 * @typedef {entryData[]} entries
 */
/**
 *
 * @param {string} orgId
 * @param {string} transactionId
 * @param {string} transactionType
 * @param {accountMapping[]} incomeAccounts
 * @returns {Promise.<entries>}
 */

import { AccountMapping, MappedEntry } from "../../types";

export default async function getIncomeEntries(
  orgId: string,
  transactionId: string,
  transactionType: string,
  incomeAccounts: AccountMapping[]
): Promise<MappedEntry[]> {
  console.log({ incomeAccounts });
  const entries = await Promise.all(
    incomeAccounts.map(async (account) => {
      const { accountId } = account;
      const entryData = await getAccountTransactionEntry(
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
