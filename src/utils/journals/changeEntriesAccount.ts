import getRawAmount from "./getRawAmount";
import updateEntry from "./updateEntry";
import updateAccount from "./updateAccount";
import { verifyAccountId, verifyEntryData } from "./helpers";

import { Transaction } from "firebase/firestore";
import { Account, UserProfile, EntryToChange } from "../../models";

export default function changeEntriesAccount(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  from: Account,
  to: Account,
  entries: EntryToChange[]
) {
  /**
   * confirm that the 2 given accounts are different
   */
  if (from.accountId === to.accountId) {
    throw new Error(
      `To change the entries account, different accounts must be provided. Found 2 duplicate accounts with id ${from.accountId}!`
    );
  }
  /**
   * compute adjustments for the two main accounts
   */
  const { fromAdjustment, toAdjustment } = getAccountsAdjustments(entries);
  console.log({ fromAdjustment, toAdjustment });
  /**
   * update previous account
   *
   */
  updateAccount(transaction, orgId, from.accountId, fromAdjustment);
  /**
   * update new account
   */
  updateAccount(transaction, orgId, to.accountId, toAdjustment);
  /**
   * update entries
   */
  entries.forEach((entry) => {
    const { prevEntry, prevAccount, amount, ...rest } = entry;
    console.log({ amount });
    /**
     * verify entry data is valid
     */
    verifyEntryData(prevEntry);
    /**
     * check to ensure all entries have same account as the previous account
     */
    verifyAccountId(from.accountId, prevAccount.accountId);
    /**
     * update current entry
     * change account to the new account
     */
    updateEntry(transaction, userProfile, orgId, {
      ...prevEntry,
      ...rest,
      amount,
      account: to,
      entryId: prevEntry.entryId,
    });
  });
}

function getAccountsAdjustments(entries: EntryToChange[]) {
  let { fromAdjustment, toAdjustment } = entries.reduce(
    (summary, entry) => {
      const {
        amount,
        prevEntry,
        prevAccount: { accountType },
      } = entry;

      const { fromAdjustment, toAdjustment } = summary;

      /**
       * compute the previous raw value that was added to the entry
       */
      const prevAmount = getRawAmount(accountType, prevEntry);

      return {
        fromAdjustment: fromAdjustment + prevAmount,
        toAdjustment: toAdjustment + amount,
      };
    },
    { fromAdjustment: 0, toAdjustment: 0 }
  );
  fromAdjustment = 0 - fromAdjustment;

  return { fromAdjustment, toAdjustment };
}
