import { doc, serverTimestamp, increment } from "firebase/firestore";
import { db } from "../firebase";

import { getAmountState } from "./newEntry";

/**
 * debit on increase (amount to be added)
 * credit on decrease (amount to be subtracted)
 */

export default function updateEntry(
  transaction,
  userProfile = { email: "" },
  orgId,
  entryId,
  accountId,
  data = {
    accountSummaryAdjustment: 0,
    debit: 0,
    credit: 0,
    amount: 0,
    transactionDetails: {},
  }
) {
  // console.log({ data });
  const { accountSummaryAdjustment, ...rest } = data;
  const { amount } = rest;
  const amountState = getAmountState(amount);

  const accountRef = doc(db, "organizations", orgId, "accounts", accountId);
  const entryRef = doc(db, "organizations", orgId, "journals", entryId);
  const { email } = userProfile;

  transaction.update(accountRef, {
    amount: increment(accountSummaryAdjustment),
  });

  // console.log({ accountId, entryId });

  transaction.update(entryRef, {
    ...rest,
    amountState,
    modifiedAt: serverTimestamp(),
    modifiedBy: email,
  });
}
