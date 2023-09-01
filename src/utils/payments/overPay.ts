import {
  createSimilarAccountEntries,
  updateSimilarAccountEntries,
} from "../journals";
import { getAccountData } from "../accounts";

import { Transaction } from "firebase/firestore";
import { UserProfile, Account, Entry, PaymentReceivedForm } from "../../types";

interface PaymentData extends PaymentReceivedForm {
  paymentId: string;
}

function createEntry(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  amount: number,
  paymentData: PaymentData,
  accounts: Account[]
) {
  const { reference, paymentId } = paymentData;
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
        transactionDetails: { ...paymentData },
        transactionId: paymentId,
        transactionType: "customer_payment",
      },
    ]
  );
}

function updateEntry(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  amount: number,
  paymentData: PaymentData,
  entryData: Entry,
  accounts: Account[]
) {
  const { paymentId, reference } = paymentData;
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
          transactionDetails: { ...paymentData },
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
