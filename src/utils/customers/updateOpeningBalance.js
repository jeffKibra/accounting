import { doc, serverTimestamp, increment } from "firebase/firestore";

import { db } from "../firebase";
import {
  updateSimilarAccountEntries,
  createSimilarAccountEntries,
  deleteSimilarAccountEntries,
} from "../journals";
import { getAccountData } from "../accounts";
import { getDateDetails } from "../dates";
import { updateInvoice, deleteInvoice, createInvoice } from "../invoices";
import { getCustomerData } from ".";
import { getTransactionEntries } from "../journals";

export default async function createCustomer(
  transaction,
  orgId = "",
  userProfile = { email: "" },
  accounts,
  customerData = {
    customerId: "",
    openingBalance: 0,
  }
) {
  const { customerId, openingBalance } = customerData;
  const { email } = userProfile;
  const customerRef = doc(db, "organizations", orgId, "customers", customerId);
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);

  const [customer, entries] = await Promise.all([
    getCustomerData(transaction, orgId, customerId),
    getTransactionEntries(orgId, customerId),
  ]);
  const { openingBalance: currentOB } = customer;
  /**
   * check if the amounts are the same
   * dont proceed
   */
  if (currentOB === openingBalance) {
    return;
  }
  /**
   * check if incoming value is negative
   */
  if (openingBalance < 0) {
    throw new Error("Customer Opening balance should be greater than zero(0)!");
  }
  /**
   * check if value has been deleted
   */
  if (currentOB > 0 && openingBalance === 0) {
    entries.forEach((entry) => {
      const { account } = entry;
      deleteSimilarAccountEntries(
        transaction,
        userProfile,
        orgId,
        account,
        entries
      );
    });
  }
  /**
   * if opening balance is greater than zero
   * create journal entries and an equivalent invoice
   */
  if (openingBalance > 0) {
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

        transactionId: customerId,
        transactionType: "opening balance",
      },
    ]);
    /**
     * 2. credit opening_balance_adjustments entry for customer opening balance
     */
    const obAdjustments = getAccountData(
      "opening_balance_adjustments",
      accounts
    );
    updateSimilarAccountEntries(
      transaction,
      userProfile,
      orgId,
      obAdjustments,
      [
        {
          amount: +openingBalance,
          account: obAdjustments,
          reference: "",

          transactionId: customerId,
          transactionType: "opening balance",
        },
      ]
    );
    /**
     * create an invoice equivalent for for customer opening balance
     */
    const salesAccount = getAccountData("sales", accounts);
  }
  /**
   * create customer
   */
  transaction.set(customerRef, {
    openingBalance,
    createdBy: email,
    createdAt: serverTimestamp(),
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
