/**
 *
 * @typedef {import('.').entryWithAccount} entryWithAccount
 * @typedef {import('.').entriesGroup} entriesGroup
 */
/**
 *
 * @param {entryWithAccount[]} entries
 * @returns {entriesGroup[]} groupedEntries
 */

import { GroupedEntries, Entry } from "../../models";

let initialAccounts: GroupedEntries[];

export default function groupEntriesIntoAccounts(entries: Entry[]) {
  return entries.reduce((accounts, entry) => {
    console.log({ accounts });
    const {
      account: { accountId },
    } = entry;
    const index = accounts.findIndex(
      (account) => account.accountId === accountId
    );
    console.log({ index });

    if (index === -1) {
      //account not in summary yet
      return [
        ...accounts,
        {
          ...entry.account,
          entries: [entry],
        },
      ];
    } else {
      //account has been found
      return accounts.map((account, i) => {
        if (i === index) {
          const { entries } = account;
          return {
            ...account,
            entries: [...entries, entry],
          };
        } else {
          return account;
        }
      });
    }
  }, initialAccounts);
}
