import { doc, serverTimestamp, Transaction } from "firebase/firestore";
import { db } from "../firebase";

import { getAmountState, createDebitAndCredit } from ".";

/**
 * debit on increase (amount to be added)
 * credit on decrease (amount to be subtracted)
 */

import { EntryToUpdate, UserProfile } from "../../types";

export default function updateEntry(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  entry: EntryToUpdate
) {
  console.log({ entry });
  const { entryId, ...rest } = entry;
  const {
    amount,
    account: { accountType },
  } = rest;
  /**
   * is the value +ve, -ve or zero(0)
   * to aid with querying
   */
  const amountState = getAmountState(amount);
  /**
   * determine whether value is a debit or a credit
   */
  const { credit, debit } = createDebitAndCredit(accountType, amount);

  // console.log({ accountId, entryId });
  /**
   * update entry
   */
  const entryRef = doc(db, "organizations", orgId, "journals", entryId);
  const { email } = userProfile;

  transaction.update(entryRef, {
    ...rest,
    credit,
    debit,
    amountState,
    modifiedAt: serverTimestamp(),
    modifiedBy: email,
  });
}
