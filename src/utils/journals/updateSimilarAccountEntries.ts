import updateAccount from "./updateAccount";
import getRawAmount from "./getRawAmount";
import { verifyAccountId, verifyEntryData } from "./helpers";
import updateEntry from "./updateEntry";

import { Transaction } from "firebase/firestore";
import { UserProfile, Account, EntryToUpdate } from "../../models";

export default function updateSimilarAccountEntries(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  account: Account,
  entries: EntryToUpdate[]
) {
  /**
   * compute adjustments for the two main accounts
   */
  const adjustment = calculateAccountAdjustment(entries);
  /**
   * update new account
   * add adjustment to the accounts amount
   * if new total is greater then prev
   * adjustment is +ve
   * else adjustment is -ve
   */
  updateAccount(transaction, orgId, account.accountId, adjustment);
  /**
   * update entries
   */
  entries.forEach((entry) => {
    const {
      account: { accountId },
    } = entry;
    /**
     * verify entry data is valid
     */
    verifyEntryData(entry);
    /**
     * check to ensure all entries have same account as the previous account
     */
    verifyAccountId(account.accountId, accountId);
    /**
     * update individual entry
     */
    updateEntry(transaction, userProfile, orgId, entry);
  });
}

function calculateAccountAdjustment(entries: EntryToUpdate[]) {
  const { current, incoming } = entries.reduce(
    (summary, entry) => {
      const { current, incoming } = summary;
      const {
        amount,
        account: { accountType },
      } = entry;

      const prevAmount = getRawAmount(accountType, entry);

      return {
        current: current + prevAmount,
        incoming: incoming + amount,
      };
    },
    { current: 0, incoming: 0 }
  );

  return incoming - current;
}
