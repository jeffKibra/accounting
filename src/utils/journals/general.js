import {
  doc,
  collection,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";
import getMonth from "../getMonth";

function getAmountState(amount = 0) {
  /**
   * functions returns a string to represent the amount value
   * for easier querying of data
   */
  return amount === 0 ? "zero" : amount > 0 ? "positive" : "negative";
}

/**
 * debit on increase (amount to be added)
 * credit on decrease (amount to be subtracted)
 */
export function newEntry(
  transaction,
  userProfile = { email: "" },
  orgId,
  accountId,
  data = {
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
    debit: 0,
    credit: 0,
  }
) {
  const { amount } = data;
  const amountState = getAmountState(amount);

  // console.log({ amount });
  const accountRef = doc(db, "organizations", orgId, "accounts", accountId);
  const newEntryRef = doc(collection(db, "organizations", orgId, "journals"));
  const { email } = userProfile;

  const month = getMonth();

  transaction.update(accountRef, {
    amount: increment(amount),
  });

  const allData = {
    ...data,
    amountState,
    createdAt: serverTimestamp(),
    createdBy: email,
    modifiedAt: serverTimestamp(),
    modifiedBy: email,
    month,
    status: "active",
  };

  // console.log({ allData });

  transaction.set(newEntryRef, {
    ...allData,
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
