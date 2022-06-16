import { doc, serverTimestamp, collection } from "firebase/firestore";
import { db } from "../firebase";

import getAmountState from "./getAmountState";
import createDebitAndCredit from "./createDebitAndCredit";
import { getDateDetails } from "../dates";

export default function createEntry(
  transaction,
  userProfile = { email: "" },
  orgId,
  entry = {
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
  }
) {
  const {
    amount,
    account: { accountType },
  } = entry;
  /**
   * is the value +ve, -ve or zero(0)
   * to aid with querying
   */
  const amountState = getAmountState(amount);
  /**
   * determine whether value is a debit or a credit
   */
  const { credit, debit } = createDebitAndCredit(accountType, amount);
  /**
   * update entry
   */
  const entryRef = doc(collection(db, "organizations", orgId, "journals"));
  const { email } = userProfile;
  const date = getDateDetails();

  transaction.set(entryRef, {
    ...entry,
    status: "active",
    credit,
    debit,
    amountState,
    date,
    createdAt: serverTimestamp(),
    createdBy: email,
    modifiedAt: serverTimestamp(),
    modifiedBy: email,
  });
}
