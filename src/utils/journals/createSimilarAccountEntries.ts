import updateAccount from "./updateAccount";
import createEntry from "./createEntry";
import { verifyAccountId } from "./helpers";

import { Transaction } from "firebase/firestore";
import { UserProfile, Account, EntryToCreate } from "../../models";

export default function createSimilarAccountEntries(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  account: Account,
  entries: EntryToCreate[]
) {
  /**
   * compute adjustments for the two main accounts
   */
  const adjustment = calculateAccountAdjustment(entries);
  /**
   * update new account
   * add adjustment to the accounts amount
   */
  updateAccount(transaction, orgId, account.accountId, adjustment);
  /**
   * create entries
   */
  entries.forEach((entry) => {
    const {
      account: { accountId },
    } = entry;
    /**
     * check to ensure all entries have same account
     */
    verifyAccountId(account.accountId, accountId);
    /**
     * create the entry
     */
    createEntry(transaction, userProfile, orgId, entry);
  });
}

function calculateAccountAdjustment(entries: EntryToCreate[]) {
  return entries.reduce((sum, entry) => {
    return sum + +entry.amount;
  }, 0);
}
