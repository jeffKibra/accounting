import { doc, increment } from "firebase/firestore";

import { db } from "../firebase";
import getRawAmount from "./getRawAmount";
import updateEntries from "./updateEntries";
import { verifyAccountId, verifyEntryData } from "./helpers";

export default function updateEntriesAndAccount(
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
      entryId: "",
      debit: 0,
      credit: 0,
    },
  ]
) {
  /**
   * generate entries with some edits
   */
  const newEntries = entries.map((entry) => {
    const {
      entryId,
      credit,
      debit,
      account: { accountId },
    } = entry;
    /**
     * verify entry data is valid
     */
    verifyEntryData({ entryId, credit, debit });
    /**
     * check to ensure all entries have same account as the previous account
     */
    verifyAccountId(account.accountId, accountId);
    /**
     * compute the previous raw value that was added to the
     */
    const prevAmount = getRawAmount(account.accountType, { debit, credit });

    return {
      ...entry,
      prevAmount,
    };
  });
  /**
   * compute adjustments for the two main accounts
   */
  const adjustment = calculateAccountAdjustment(newEntries);
  /**
   * create main accounts refs
   */
  const accountRef = doc(
    db,
    "organizations",
    orgId,
    "accounts",
    account.accountId
  );
  /**
   * update new account
   * add adjustment to the accounts amount
   * if new total is greater then prev
   * adjustment is +ve
   * else adjustment is -ve
   */
  transaction.update(accountRef, {
    amount: increment(adjustment),
  });
  /**
   * update entries
   */
  updateEntries(transaction, userProfile, orgId, newEntries);
}

function calculateAccountAdjustment(entries = [{ prevAmount: 0, amount: 0 }]) {
  const { current, incoming } = entries.reduce(
    (summary, entry) => {
      const { current, incoming } = summary;
      const { amount, prevAmount } = entry;

      return {
        current: current + prevAmount,
        incoming: incoming + amount,
      };
    },
    { current: 0, incoming: 0 }
  );

  return incoming - current;
}
