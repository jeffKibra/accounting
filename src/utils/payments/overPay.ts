import {
  createSimilarAccountEntries,
  updateSimilarAccountEntries,
} from "../journals";
import { getAccountData } from "../accounts";

import { Transaction } from "firebase/firestore";
import {
  UserProfile,
  PaymentReceivedDetails,
  Account,
  Entry,
} from "../../types";

function createEntry(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  amount: number,
  transactionDetails: PaymentReceivedDetails,
  accounts: Account[]
) {
  const { reference, paymentId } = transactionDetails;
  /**
   * excess amount - credit account with the excess amount
   */
  //accounts data
  const unearned_revenue = getAccountData("unearned_revenue", accounts);
  /**
   * create new entry
   */
  createSimilarAccountEntries(
    transaction,
    userProfile,
    orgId,
    unearned_revenue,
    [
      {
        account: unearned_revenue,
        amount,
        reference,
        transactionDetails: { ...transactionDetails },
        transactionId: paymentId,
        transactionType: "customer payment",
      },
    ]
  );
}

function updateEntry(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  amount: number,
  transactionDetails: PaymentReceivedDetails,
  entryData: Entry,
  accounts: Account[]
) {
  const { paymentId, reference } = transactionDetails;
  const { debit, credit } = entryData;
  const entryAmount = credit > 0 ? credit : debit;
  /**
   * excess amount - credit account with the excess amount
   */
  //accounts data
  const unearned_revenue = getAccountData("unearned_revenue", accounts);

  if (entryAmount !== amount) {
    /**
     * update the entry with the updated details
     */
    updateSimilarAccountEntries(
      transaction,
      userProfile,
      orgId,
      unearned_revenue,
      [
        {
          amount,
          ...entryData,
          reference,
          transactionId: paymentId,
          transactionDetails: { ...transactionDetails },
        },
      ]
    );
  }
}

const overPay = {
  createEntry,
  updateEntry,
};

export default overPay;
