import { doc, increment } from "firebase/firestore";

import { db } from "../firebase";
import getRawAmount from "./getRawAmount";
import updateEntries from "./updateEntries";
import { verifyAccountId, verifyEntryData } from "./helpers";

export default function changeAccount(
  transaction,
  userProfile,
  orgId,
  from = {
    accountId: "",
    accountType: { id: "", main: "", name: "" },
    name: "",
  },
  to = { accountId: "", accountType: { id: "", main: "", name: "" }, name: "" },
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
      entryId: "",
      debit: 0,
      credit: 0,
    },
  ]
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
   * generate entries with some edits
   */
  const newEntries = entries.map((entry) => {
    const { entryId, credit, debit, account } = entry;
    /**
     * verify entry data is valid
     */
    verifyEntryData({ entryId, credit, debit });
    /**
     * check to ensure all entries have same account as the previous account
     */
    verifyAccountId(from.accountId, account.accountId);
    /**
     * compute the previous raw value that was added to the
     */
    const prevAmount = getRawAmount(from.account.accountType, from.entryData);
    /**
     * update amount to update.
     * if no amount is given, use the previous amount
     */
    return {
      ...entry,
      prevAmount,
      account: to,
    };
  });
  /**
   * compute adjustments for the two main accounts
   */
  const { fromAdjustment, toAdjustment } = getAccountsAdjustments(newEntries);
  /**
   * create main accounts refs
   */
  const fromRef = doc(db, "organizations", orgId, "accounts", from.accountId);
  const toRef = doc(db, "organizations", orgId, "accounts", to.accountId);
  /**
   * update previous account
   * subtract the adjustment from the accounts ammount
   */
  transaction.update(fromRef, {
    amount: increment(0 - fromAdjustment),
  });
  /**
   * update new account
   * add adjustment to the accounts amount
   */
  transaction.update(toRef, {
    amount: increment(toAdjustment),
  });
  /**
   * update entries
   */
  updateEntries(transaction, userProfile, orgId, newEntries);
}

function getAccountsAdjustments(entries = [{ prevAmount: 0, amount: 0 }]) {
  return entries.reduce(
    (summary, entry) => {
      const { prevAmount, amount } = entry;
      const { fromAdjustment, toAdjustment } = summary;

      return {
        fromAdjustment: fromAdjustment + prevAmount,
        toAdjustment: toAdjustment + amount,
      };
    },
    { fromAdjustment: 0, toAdjustment: 0 }
  );
}
