import { doc, increment } from "firebase/firestore";

import { db } from "../firebase";
import createEntry from "./createEntry";
import { verifyAccountId } from "./helpers";

export default function createSimilarAccountEntries(
  transaction,
  userProfile,
  orgId,
  account = {
    accountId: "",
    accountType: { id: "", main: "", name: "" },
    name: "",
  },
  entries = [
    {
      amount: 0,
      transactionType: "",
      transactionId: "",
      transactionDetails: "",
      reference: "",
      account: {
        accountId: "",
        accountType: { id: "", main: "", name: "" },
        name: "",
      },
    },
  ]
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
  const accountRef = doc(
    db,
    "organizations",
    orgId,
    "accounts",
    account.accountId
  );
  transaction.update(accountRef, {
    amount: increment(adjustment),
  });
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

function calculateAccountAdjustment(entries = [{ amount: 0 }]) {
  return entries.reduce((sum, entry) => {
    return sum + +entry.amount;
  }, 0);
}
