import getRawAmount from "./getRawAmount";
import { verifyAccountId } from "./helpers";
import deleteEntry from "./deleteEntry";
import updateAccount from "./updateAccount";

import { Transaction } from "firebase/firestore";
import { UserProfile, Account, EntryToDelete } from "../../types";

export default function deleteSimilarAccountEntries(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  account: Account,
  entries: EntryToDelete[]
) {
  /**
   * compute adjustment to be applied.
   * value is also given the correct sign (+ve || -ve)
   */
  const adjustment = calculateAccountAdjustment(entries);
  console.log({ adjustment, accountId: account.accountId });
  /**
   * add adjustment to the accounts amount
   */
  updateAccount(transaction, orgId, account.accountId, adjustment);
  /**
   * delete entries
   */
  entries.forEach((entry) => {
    const {
      entryId,
      account: { accountId },
    } = entry;
    /**
     * check to ensure all entries have same account
     */
    verifyAccountId(account.accountId, accountId);
    /**
     * update individual entry
     */
    deleteEntry(transaction, userProfile, orgId, entryId);
  });
}

function calculateAccountAdjustment(entries: EntryToDelete[]) {
  const sum = entries.reduce((sum, entry) => {
    const {
      account: { accountType },
    } = entry;

    const prevAmount = getRawAmount(accountType, entry);
    console.log({ prevAmount });

    return sum + +prevAmount;
  }, 0);
  /**
   * subtract sum from zero(0) to get the amount of adjustment.
   * if sum is +ve, adjustment should be negative
   * the reverse is also true
   */
  return 0 - sum;
}
