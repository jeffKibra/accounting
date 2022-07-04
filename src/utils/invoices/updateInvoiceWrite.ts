import { doc, serverTimestamp, increment } from "firebase/firestore";

import { db } from "../firebase";
import {
  updateSimilarAccountEntries,
  deleteSimilarAccountEntries,
  createSimilarAccountEntries,
} from "../journals";
import { getAccountData } from "../accounts";
import formats from "../formats";

/**
 *
 * @typedef {import('.').invoice} invoice
 * @typedef {import('firebase/firestore').Transaction} transaction
 * @typedef {import('../accounts').account} account
 * @typedef {import('../accounts').accountMapping} accountMapping
 * @typedef {import('../journals').entryData} entryData
 * @typedef {import('.').invoice} invoice
 */

/**
 * updateInvoiceWrite - receives neccessary data to update invoice.
 * does not fetch any data
 * @param {transaction} transaction
 * @param {string} orgId
 * @param {{email:""}} userProfile
 * @param {account[]} accounts
 * @param {entryData[]} entriesToUpdate
 * @param {entryData[]} entriesToDelete
 * @param {account[]} newAccounts
 * @param {invoice} currentInvoice
 * @param {invoice} incomingInvoice
 * @param {string} transactionType
 */

export default function updateInvoiceWrite(
  transaction,
  orgId,
  userProfile,
  accounts,
  entriesToUpdate,
  entriesToDelete,
  newAccounts,
  currentInvoice,
  incomingInvoice,
  transactionType = "invoice"
) {
  const { email } = userProfile;
  const { invoiceId, ...rest } = incomingInvoice;
  const {
    summary: { totalAmount },
    selectedItems,
    customerId,
    customer,
  } = rest;
  const {
    summary: { totalAmount: currentTotal },
    customer: { customerId: currentCustomerId },
  } = currentInvoice;

  // console.log({ data });

  /**
   * formulate data
   */
  const invoiceData = {
    ...rest,
    customer: formats.formatCustomerData(customer),
    selectedItems: formats.formatSaleItems(selectedItems),
  };

  const transactionDetails = {
    ...invoiceData,
    invoiceId,
  };
  const transactionId = invoiceId;
  /**
   * start writing
   */

  /**
   * update entries
   */
  entriesToUpdate.forEach((entry) => {
    const { accountId, incoming, credit, debit, entryId } = entry;
    const entryAccount = getAccountData(accountId, accounts);

    updateSimilarAccountEntries(transaction, userProfile, orgId, entryAccount, [
      {
        amount: incoming,
        account: entryAccount,
        credit,
        debit,
        entryId,
        transactionDetails,
        transactionId,
      },
    ]);
  });
  /**
   * delete deleted income accounts
   */
  entriesToDelete.forEach((entry) => {
    const { accountId, credit, debit, entryId } = entry;
    const entryAccount = getAccountData(accountId, accounts);

    deleteSimilarAccountEntries(transaction, userProfile, orgId, entryAccount, [
      {
        account: entryAccount,
        credit,
        debit,
        entryId,
      },
    ]);
  });
  /**
   * create new entries for new income accounts
   */
  newAccounts.forEach((incomeAccount) => {
    const { accountId, incoming } = incomeAccount;
    const entryAccount = getAccountData(accountId, accounts);

    createSimilarAccountEntries(transaction, userProfile, orgId, entryAccount, [
      {
        amount: incoming,
        account: entryAccount,
        reference: "",
        transactionDetails,
        transactionId,
        transactionType: "invoice",
      },
    ]);
  });
  /**
   * update customer summaries
   * only allowed where transactionType is invoice
   */
  if (transactionType === "invoice") {
    const newCustomerRef = doc(
      db,
      "organizations",
      orgId,
      "customers",
      customerId
    );
    const currentCustomerRef = doc(
      db,
      "organizations",
      orgId,
      "customers",
      currentCustomerId
    );
    /**
     * check if customer has been changed
     */
    const customerHasChanged = currentCustomerId !== customerId;

    if (customerHasChanged) {
      //delete values from previous customer
      transaction.update(currentCustomerRef, {
        "summary.invoicedAmount": increment(0 - currentTotal),
        "summary.deletedInvoices": increment(1),
      });
      //add new values to the incoming customer
      transaction.update(newCustomerRef, {
        "summary.invoicedAmount": increment(totalAmount),
        "summary.invoices": increment(1),
      });
    } else {
      if (currentTotal !== totalAmount) {
        const adjustment = totalAmount - currentTotal;
        //update customer summaries
        transaction.update(currentCustomerRef, {
          "summary.invoicedAmount": increment(adjustment),
        });
      }
    }
  }
  /**
   * calculate balance adjustment
   */
  const balanceAdjustment = totalAmount - currentTotal;
  /**
   * update invoice
   */
  const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);
  console.log({ invoiceData });
  transaction.update(invoiceRef, {
    ...invoiceData,
    balance: increment(balanceAdjustment),
    // classical: "plus",
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
