import { doc, serverTimestamp, increment } from "firebase/firestore";

import { db } from "../firebase";
import {
  updateSimilarAccountEntries,
  deleteSimilarAccountEntries,
  createSimilarAccountEntries,
  changeEntriesAccount,
  getIncomeEntries,
  getAccountTransactionEntry,
} from "../journals";

import {
  getAccountData,
  getAccountsMapping,
  getIncomeAccountsMapping,
} from "../accounts";
import { changePaymentMode, updatePaymentMode } from "../summaries";
import { getSalesReceiptData } from "../salesReceipts";
import formats from "../formats";

export default async function updateSalesReceipt(
  transaction,
  orgId = "",
  userProfile = { email: "" },
  accounts = [{ name: "", accountId: "", accountType: {} }],
  data = {
    salesReceiptId: "",
    summary: {
      totalAmount: 0,
      shipping: 0,
      adjustment: 0,
      totalTaxes: 0,
      taxes: [],
    },
    customerId: "",
    accountId: "",
    reference: "",
    customerNotes: "",
    receiptDate: new Date(),
    paymentModeId: "",
    selectedItems: [
      {
        salesAccount: { name: "", accountId: "", accountType: {} },
        totalAmount: 0,
      },
    ],
  }
) {
  const { email } = userProfile;
  const { salesReceiptId, ...rest } = data;
  const {
    summary,
    selectedItems,
    customerId,
    customer,
    accountId,
    paymentModeId,
    reference,
  } = rest;
  // console.log({ data });
  const { totalTaxes, shipping, adjustment, totalAmount } = summary;

  const [currentSalesReceipt] = await Promise.all([
    getSalesReceiptData(transaction, orgId, salesReceiptId),
  ]);

  const {
    customerId: currentCustomerId,
    selectedItems: items,
    summary: currentSummary,
  } = currentSalesReceipt;
  /**
   * check if customer has been changed
   */

  const customerHasChanged = currentCustomerId !== customerId;

  let { deletedAccounts, newAccounts, updatedAccounts, similarAccounts } =
    getIncomeAccountsMapping(items, selectedItems);
  const summaryAccounts = getAccountsMapping([
    {
      incoming: shipping,
      current: currentSummary.shipping,
      accountId: "shipping_charge",
    },
    {
      incoming: adjustment,
      current: currentSummary.adjustment,
      accountId: "other_charges",
    },
    {
      incoming: totalTaxes,
      current: currentSummary.totalTaxes,
      accountId: "tax_payable",
    },
  ]);

  similarAccounts = [...similarAccounts, ...summaryAccounts.similarAccounts];
  deletedAccounts = [...deletedAccounts, ...summaryAccounts.deletedAccounts];
  newAccounts = [...newAccounts, ...summaryAccounts.newAccounts];
  updatedAccounts = [...updatedAccounts, ...summaryAccounts.updatedAccounts];
  const accountsToUpdate = [...similarAccounts, ...updatedAccounts];
  /**
   * get entries data for deletedAccounts and accountsToUpdate
   */
  const [entriesToUpdate, entriesToDelete, paymentAccountEntry] =
    await Promise.all([
      getIncomeEntries(
        orgId,
        salesReceiptId,
        "sales receipt",
        accountsToUpdate
      ),
      getIncomeEntries(orgId, salesReceiptId, "sales receipt", deletedAccounts),
      getAccountTransactionEntry(
        orgId,
        currentSalesReceipt.accountId,
        salesReceiptId,
        "sales receipt"
      ),
    ]);
  const paymentAccountEntries = [paymentAccountEntry];
  //currentSummary

  const tDetails = {
    ...rest,
    customer: formats.formatCustomerData(customer),
    selectedItems: formats.formatSaleItems(selectedItems),
  };

  const transactionDetails = {
    ...tDetails,
    salesReceiptId,
  };
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
        transactionId: salesReceiptId,
        transactionType: "sales receipt",
      },
    ]);
  });

  /**
   * update deposit account
   * check if the account was changed and update accordingly
   */
  const depositAccount = getAccountData(accountId, accounts);
  /**
   * check if payment account has changed
   */
  const paymentAccountHasChanged = accountId !== currentSalesReceipt.accountId;

  if (paymentAccountHasChanged) {
    /**
     * change the entries details and update associated accounts
     */
    console.log("account has changed");
    changeEntriesAccount(
      transaction,
      userProfile,
      orgId,
      currentSalesReceipt.account,
      depositAccount,
      paymentAccountEntries.map((entry) => {
        const { credit, debit, entryId } = entry;
        const prevEntry = { credit, debit, entryId };
        return {
          amount: totalAmount,
          prevAccount: currentSalesReceipt.account,
          prevEntry,
          transactionDetails,
          reference,
        };
      })
    );
  } else {
    /**
     * do a normal update
     */
    if (totalAmount !== currentSummary.totalAmount || customerHasChanged) {
      console.log("normal update");
      updateSimilarAccountEntries(
        transaction,
        userProfile,
        orgId,
        depositAccount,
        paymentAccountEntries.map((entry) => {
          const { entryId, credit, debit, account } = entry;
          return {
            amount: totalAmount,
            account,
            credit,
            debit,
            entryId,
            transactionDetails,
          };
        })
      );
    }
  }
  /**
   * update summary payment modes
   * if mode has changed, change the mode values
   */
  if (currentSalesReceipt.paymentModeId === paymentModeId) {
    if (currentSummary.totalAmount !== totalAmount) {
      /**
       * create adjustment by subtracting current amount from incoming amount
       */
      const modeAdjustment = totalAmount - currentSummary.totalAmount;
      updatePaymentMode(transaction, orgId, paymentModeId, modeAdjustment);
    }
  } else {
    /**
     * payment modes are not the same
     */
    changePaymentMode(
      transaction,
      orgId,
      {
        amount: currentSummary.totalAmount,
        paymentModeId: currentSalesReceipt.paymentModeId,
      },
      { amount: totalAmount, paymentModeId }
    );
  }
  /**
   * update customer summaries
   */
  const newCustomerRef = customerId
    ? doc(db, "organizations", orgId, "customers", customerId)
    : null;
  const currentCustomerRef = currentCustomerId
    ? doc(db, "organizations", orgId, "customers", currentCustomerId)
    : null;
  /**
   * opening balance is strictly tied to a customer.
   * cant change hence no need to change anything
   */
  if (customerHasChanged) {
    //delete values from previous customer
    if (currentCustomerRef) {
      transaction.update(currentCustomerRef, {
        "summary.salesReceiptsAmount": increment(
          0 - currentSummary.totalAmount
        ),
        "summary.deletedSalesReceipts": increment(1),
      });
    }
    if (newCustomerRef) {
      //add new values to the incoming customer
      transaction.update(newCustomerRef, {
        "summary.salesReceiptsAmount": increment(totalAmount),
        "summary.salesReceipts": increment(1),
      });
    }
  } else {
    if (currentCustomerRef) {
      if (currentSummary.totalAmount !== totalAmount) {
        const adjustment = totalAmount - currentSummary.totalAmount;
        //update customer summaries
        transaction.update(currentCustomerRef, {
          "summary.salesReceiptsAmount": increment(adjustment),
        });
      }
    }
  }
  /**
   * update sales receipt
   */
  const salesReceiptRef = doc(
    db,
    "organizations",
    orgId,
    "salesReceipts",
    salesReceiptId
  );
  // console.log({ tDetails });
  transaction.update(salesReceiptRef, {
    ...tDetails,
    // classical: "plus",
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
