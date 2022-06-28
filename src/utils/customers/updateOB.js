import { serverTimestamp } from "firebase/firestore";

import { updateSimilarAccountEntries } from "../journals";
import { getAccountData } from "../accounts";
import { updateInvoice } from "../invoices";

export default async function updateOB(
  transaction,
  org = { id: "" },
  userProfile = { email: "" },
  accounts,
  customerId,
  transactionDetails = {
    openingBalance: 0,
  }
) {
  const orgId = org.id;
  const { openingBalance, paymentTermId, paymentTerm } = transactionDetails;
  /**
   * create 2 journal entries
   * 1. debit sales accountType= opening balance
   * 2. credit opening_balance_adjustments accountType= opening balance
   */
  /**
   * 1. debit sales
   * to debit income, amount must be negative
   */
  const sales = getAccountData("sales", accounts);
  updateSimilarAccountEntries(transaction, userProfile, orgId, sales, [
    {
      amount: 0 - openingBalance,
      account: sales,
      reference: "",
      transactionDetails,
      transactionId: customerId,
      transactionType: "opening balance",
    },
  ]);
  /**
   * 2. credit opening_balance_adjustments entry for customer opening balance
   */
  const obAdjustments = getAccountData("opening_balance_adjustments", accounts);
  updateSimilarAccountEntries(transaction, userProfile, orgId, obAdjustments, [
    {
      amount: +openingBalance,
      account: obAdjustments,
      reference: "",
      transactionDetails,
      transactionId: customerId,
      transactionType: "opening balance",
    },
  ]);
  /**
   * create an invoice equivalent for for customer opening balance
   */
  const salesAccount = getAccountData("sales", accounts);
  await updateInvoice(
    transaction,
    org,
    userProfile,
    accounts,
    customerId,
    {
      customerId,
      customer: transactionDetails,
      invoiceDate: serverTimestamp(),
      dueDate: serverTimestamp(),
      paymentTerm,
      paymentTermId,
      summary: {
        shipping: 0,
        adjustment: 0,
        subTotal: 0,
        totalTaxes: 0,
        totalAmount: openingBalance,
      },
      selectedItems: [
        {
          salesAccount,
          salesAccountId: salesAccount.accountId,
          totalAmount: openingBalance,
        },
      ],
    },
    "customer opening balance"
  );
}
