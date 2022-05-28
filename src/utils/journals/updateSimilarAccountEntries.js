import { doc, increment } from "firebase/firestore";

import { db } from "../firebase";
import getRawAmount from "./getRawAmount";
import { verifyAccountId, verifyEntryData } from "./helpers";
import updateEntry from "./updateEntry";

export default function updateSimilarAccountEntries(
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
      entryId: "",
      account: {
        accountId: "",
        accountType: { id: "", main: "", name: "" },
        name: "",
      },
      debit: 0,
      credit: 0,
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
   * update entries
   */
  entries.forEach((entry) => {
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
     * update individual entry
     */
    updateEntry(transaction, userProfile, orgId, entry);
  });
}

function calculateAccountAdjustment(
  entries = [{ debit: 0, credit: 0, amount: 0, account: { accountType: {} } }]
) {
  const { current, incoming } = entries.reduce(
    (summary, entry) => {
      const { current, incoming } = summary;
      const {
        amount,
        credit,
        debit,
        account: { accountType },
      } = entry;

      const prevAmount = getRawAmount(accountType, {
        debit,
        credit,
      });

      return {
        current: current + prevAmount,
        incoming: incoming + amount,
      };
    },
    { current: 0, incoming: 0 }
  );

  return incoming - current;
}
