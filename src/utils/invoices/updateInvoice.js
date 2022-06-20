import { doc, serverTimestamp, increment } from "firebase/firestore";

import { db } from "../firebase";
import {
  updateSimilarAccountEntries,
  deleteSimilarAccountEntries,
  createSimilarAccountEntries,
  getIncomeEntries,
} from "../journals";
import { getInvoiceData, getInvoicePaymentsTotal } from "../invoices";
import { getCustomerData } from "../customers";
import {
  getAccountData,
  getAccountsMapping,
  getIncomeAccountsMapping,
} from "../accounts";
import formats from "../formats";

export default async function updateInvoice(
  transaction,
  orgId = "",
  userProfile = { email: "" },
  accounts = [{ name: "", accountId: "", accountType: {} }],
  data = {
    invoiceId: "",
    summary: { totalAmount: 0 },
    customerId: "",
    selectedItems: [
      {
        salesAccount: { name: "", accountId: "", accountType: {} },
        totalAmount: 0,
      },
    ],
  },
  isInvoice = true
) {
  const { email } = userProfile;
  const { invoiceId, ...rest } = data;
  const { summary, selectedItems, customerId } = rest;
  // console.log({ data });
  const { totalTaxes, shipping, adjustment, totalAmount } = summary;

  const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);

  const [currentInvoice, customer] = await Promise.all([
    getInvoiceData(transaction, orgId, invoiceId),
    getCustomerData(transaction, orgId, customerId),
  ]);

  const {
    customerId: currentCustomerId,
    selectedItems: items,
    payments,
    summary: currentSummary,
  } = currentInvoice;
  /**
   * check to ensure the new total balance is not less than payments made.
   */
  const paymentsTotal = getInvoicePaymentsTotal(payments);
  /**
   * trying to update invoice total with an amount less than paymentsTotal
   * throw an error
   */
  if (paymentsTotal > totalAmount) {
    throw new Error(
      `Invoice Update Failed! The new Invoice Total is less than the invoice payments. If you are sure you want to edit, delete the associated payments or adjust them to be less than or equal to the new invoice total`
    );
  }
  /**
   * check if customer has been changed
   */
  const customerHasChanged = currentCustomerId !== customerId;
  /**
   * customer cannot be changed if the invoice has some payments made to it
   */
  if (paymentsTotal > 0 && customerHasChanged) {
    throw new Error(
      `CUSTOMER cannot be changed in an invoice that has payments! This is because all the payments are from the PREVIOUS customer. If you are sure you want to change the customer, DELETE the associated payments first!`
    );
  }

  let { deletedAccounts, newAccounts, updatedAccounts, similarAccounts } =
    getIncomeAccountsMapping(items, selectedItems);
  const summaryAccounts = getAccountsMapping([
    {
      accountId: "shipping_charge",
      current: currentSummary.shipping,
      incoming: shipping,
    },
    {
      accountId: "other_charges",
      current: currentSummary.adjustment,
      incoming: adjustment,
    },
    {
      accountId: "tax_payable",
      current: currentSummary.totalTaxes,
      incoming: totalTaxes,
    },
    {
      accountId: "accounts_receivable",
      current: currentSummary.totalAmount,
      incoming: totalAmount,
    },
  ]);
  deletedAccounts = [...deletedAccounts, ...summaryAccounts.deletedAccounts];
  newAccounts = [...newAccounts, ...summaryAccounts.newAccounts];
  updatedAccounts = [...updatedAccounts, ...summaryAccounts.updatedAccounts];
  similarAccounts = [...similarAccounts, ...summaryAccounts.similarAccounts];
  /**
   * update accounts to update if also customer has changed
   */
  const accountsToUpdate = customerHasChanged
    ? [...updatedAccounts, ...similarAccounts]
    : updatedAccounts;
  /**
   * get entries data for deletedAccounts and accountsToUpdate
   */
  const [entriesToUpdate, entriesToDelete] = await Promise.all([
    getIncomeEntries(orgId, invoiceId, "invoice", accountsToUpdate),
    getIncomeEntries(orgId, invoiceId, "invoice", deletedAccounts),
  ]);
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
   */
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
   * opening balance is strictly tied to a customer.
   * cant change hence no need to change anything
   */
  if (customerHasChanged) {
    //delete values from previous customer
    transaction.update(currentCustomerRef, {
      "summary.invoicedAmount": increment(0 - currentSummary.totalAmount),
      "summary.deletedInvoices": increment(1),
    });
    //add new values to the incoming customer
    transaction.update(newCustomerRef, {
      "summary.invoicedAmount": increment(summary.totalAmount),
      "summary.invoices": increment(1),
    });
  } else {
    if (currentSummary.totalAmount !== summary.totalAmount) {
      const adjustment = summary.totalAmount - currentSummary.totalAmount;
      //update customer summaries
      transaction.update(currentCustomerRef, {
        "summary.invoicedAmount": increment(adjustment),
      });
    }
  }
  /**
   * calculate balance adjustment
   */
  const balanceAdjustment = totalAmount - currentSummary.totalAmount;
  /**
   * update invoice
   */
  // console.log({ invoiceData });
  transaction.update(invoiceRef, {
    ...invoiceData,
    balance: increment(balanceAdjustment),
    // classical: "plus",
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
