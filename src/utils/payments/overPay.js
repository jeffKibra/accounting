import {
  createSimilarAccountEntries,
  updateSimilarAccountEntries,
} from "../journals";
import { getAccountData } from "../accounts";

function createEntry(
  transaction,
  userProfile,
  orgId,
  amount,
  transactionDetails,
  accounts
) {
  const { reference, paymentSlug } = transactionDetails;
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
        transactionDetails,
        transactionId: paymentSlug,
        transactionType: "customer payment",
      },
    ]
  );
}

function updateEntry(
  transaction,
  userProfile = { email: "" },
  orgId = "",
  amount = 0,
  transactionDetails = {},
  entryData = { debit: 0, credit: 0, entryId: "" },
  accounts = [{}]
) {
  const { paymentSlug, reference } = transactionDetails;
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
          account: unearned_revenue,
          amount,
          ...entryData,
          reference,
          transactionId: paymentSlug,
          transactionDetails,
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
