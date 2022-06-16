import { doc, increment } from "firebase/firestore";

import { db } from "../firebase";
import getRawAmount from "./getRawAmount";
import updateEntry from "./updateEntry";
import { verifyAccountId, verifyEntryData } from "./helpers";

export default function changeEntriesAccount(
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
      prevAccount: {
        accountId: "",
        accountType: { id: "", main: "", name: "" },
        name: "",
      },
      prevEntry: {
        entryId: "",
        debit: 0,
        credit: 0,
      },
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
   * compute adjustments for the two main accounts
   */
  const { fromAdjustment, toAdjustment } = getAccountsAdjustments(entries);
  console.log({ fromAdjustment, toAdjustment });
  /**
   * update previous account
   * subtract the adjustment from the accounts ammount
   */
  const fromRef = doc(db, "organizations", orgId, "accounts", from.accountId);
  transaction.update(fromRef, {
    amount: increment(0 - fromAdjustment),
  });
  /**
   * update new account
   * add adjustment to the accounts amount
   */
  const toRef = doc(db, "organizations", orgId, "accounts", to.accountId);
  transaction.update(toRef, {
    amount: increment(toAdjustment),
  });
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
      ...rest,
      amount,
      account: to,
      entryId: prevEntry.entryId,
    });
  });
}

function getAccountsAdjustments(
  entries = [
    {
      amount: 0,
      prevEntry: {
        debit: 0,
        credit: 0,
      },
      prevAccount: { accountType: { id: "", main: "" } },
    },
  ]
) {
  return entries.reduce(
    (summary, entry) => {
      const {
        amount,
        prevEntry: { credit, debit },
        prevAccount: { accountType },
      } = entry;

      const { fromAdjustment, toAdjustment } = summary;

      /**
       * compute the previous raw value that was added to the entry
       */
      const prevAmount = getRawAmount(accountType, { credit, debit });

      return {
        fromAdjustment: fromAdjustment + prevAmount,
        toAdjustment: toAdjustment + amount,
      };
    },
    { fromAdjustment: 0, toAdjustment: 0 }
  );
}
