import {
  doc,
  collection,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "../../../utils/firebase";
import getMonth from "../../../utils/getMonth";
/**
 * debit on increase (amount to be added)
 * credit on decrease (amount to be subtracted)
 */
export function newEntry(
  transaction,
  userProfile = { email: "" },
  orgId,
  data = {
    amount: 0,
    transactionType: "",
    transactionId: "",
    account: { id: "", name: "" },
    transactionDetails: "",
    reference: "",
    debit: 0,
    credit: 0,
  }
) {
  const { amount, ...rest } = data;
  const {
    account: { id: accountId },
  } = rest;

  const accountRef = doc(db, "organizations", orgId, "accounts", accountId);
  const newEntryRef = doc(collection(db, "organizations", orgId, "journals"));
  const { email } = userProfile;

  const month = getMonth();

  transaction.update(accountRef, {
    amount: increment(amount),
  });

  transaction.set(newEntryRef, {
    ...rest,
    createdAt: serverTimestamp(),
    createdBy: email,
    modifiedAt: serverTimestamp(),
    modifiedBy: email,
    month,
    status: "active",
  });
}

export function updateEntry(
  transaction,
  userProfile = { email: "" },
  orgId,
  entryId,
  accountId,
  data = {
    accountSummaryAdjustment: 0,
    debit: 0,
    credit: 0,
  }
) {
  const { accountSummaryAdjustment, ...rest } = data;

  const accountRef = doc(db, "organizations", orgId, "accounts", accountId);
  const entryRef = doc(db, "organizations", orgId, "journals", entryId);
  const { email } = userProfile;

  transaction.update(accountRef, {
    amount: increment(accountSummaryAdjustment),
  });

  transaction.set(entryRef, {
    ...rest,
    modifiedAt: serverTimestamp(),
    modifiedBy: email,
  });
}

export function deleteEntry(
  transaction,
  userProfile = { email: "" },
  orgId,
  entryId,
  accountId,
  accountSummaryAdjustment
) {
  const accountRef = doc(db, "organizations", orgId, "accounts", accountId);
  const entryRef = doc(db, "organizations", orgId, "journals", entryId);
  const { email } = userProfile;

  transaction.update(accountRef, {
    amount: increment(accountSummaryAdjustment),
  });

  transaction.update(entryRef, {
    status: "deleted",
    modifiedAt: serverTimestamp(),
    modifiedBy: email,
  });
}
