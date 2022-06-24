import { doc, serverTimestamp, increment } from "firebase/firestore";

import { db } from "../firebase";
import {
  updateSimilarAccountEntries,
  deleteSimilarAccountEntries,
  createSimilarAccountEntries,
  changeEntriesAccount,
  getIncomeEntries,
  getAccountTransactionEntry,
  createCreditAmount,
  createDebitAmount,
} from "../journals";

import {
  getAccountData,
  getAccountsMapping,
  getExpenseAccountsMapping,
} from "../accounts";
import { changePaymentMode, updatePaymentMode } from "../summaries";
import { getExpenseData } from ".";
import formats from "../formats";

export default async function updateExpense(
  transaction,
  orgId = "",
  userProfile = { email: "" },
  accounts = [{ name: "", accountId: "", accountType: {} }],
  data = {
    expenseId: "",
    summary: {
      totalAmount: 0,
      subTotal: 0,
      totalTaxes: 0,
      expenseTaxes: [],
    },
    items: [
      {
        salesAccount: { name: "", accountId: "", accountType: {} },
        totalAmount: 0,
      },
    ],
    vendor: { vendorId: "" },
    paymentAccount: { accountId: "" },
    paymentMode: { value: "" },
    reference: "",
    expenseDate: new Date(),
  }
) {
  const { email } = userProfile;
  const { expenseId, ...rest } = data;
  const { summary, items, vendor, paymentAccount, paymentMode, reference } =
    rest;
  // console.log({ data });
  const { vendorId } = vendor;
  const { accountId: paymentAccountId } = paymentAccount;
  const { value: paymentModeId } = paymentMode;
  const { totalTaxes, totalAmount } = summary;
  /**
   * check if the selected payment account has enough funds
   */

  const [currentExpense] = await Promise.all([
    getExpenseData(transaction, orgId, expenseId),
  ]);

  const {
    vendor: { vendorId: currentVendorId },
    items: currentItems,
    summary: { totalTaxes: currentTaxes, totalAmount: currentTotal },
    paymentAccount: { accountId: currentPaymentAccountId },
    paymentMode: { value: currentPaymentModeId },
  } = currentExpense;
  /**
   * check if vendor has been changed
   */

  const vendorHasChanged = currentVendorId !== vendorId;

  let { deletedAccounts, newAccounts, updatedAccounts, similarAccounts } =
    getExpenseAccountsMapping(currentItems, items);
  const summaryAccounts = getAccountsMapping([
    {
      incoming: totalTaxes,
      current: currentTaxes,
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
      getIncomeEntries(orgId, expenseId, "expense", accountsToUpdate),
      getIncomeEntries(orgId, expenseId, "expense", deletedAccounts),
      getAccountTransactionEntry(
        orgId,
        currentPaymentAccountId,
        expenseId,
        "expense"
      ),
    ]);
  const paymentAccountEntries = [paymentAccountEntry];
  //currentSummary

  const tDetails = {
    ...rest,
    vendor: formats.formatVendorData(vendor),
    items: formats.formatExpenseItems(items),
  };

  const transactionDetails = {
    ...tDetails,
    expenseId,
  };
  /**
   * start writing
   */

  /**
   * update entries
   */
  entriesToUpdate.forEach((entry) => {
    console.log({ entry });
    const { accountId, incoming, credit, debit, entryId } = entry;
    const entryAccount = getAccountData(accountId, accounts);
    const { accountType } = entryAccount;
    const amount = createDebitAmount(accountType, incoming);
    console.log({ amount });

    updateSimilarAccountEntries(transaction, userProfile, orgId, entryAccount, [
      {
        amount,
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
    const { accountType } = entryAccount;

    const amount = createDebitAmount(accountType, incoming);

    createSimilarAccountEntries(transaction, userProfile, orgId, entryAccount, [
      {
        amount,
        account: entryAccount,
        reference: "",
        transactionDetails,
        transactionId: expenseId,
        transactionType: "expense",
      },
    ]);
  });

  /**
   * update deposit account
   * check if the account was changed and update accordingly
   */
  const depositAccount = getAccountData(paymentAccountId, accounts);
  const { accountType } = depositAccount;
  /**
   * check if payment account has changed
   */
  const paymentAccountHasChanged = paymentAccountId !== currentPaymentAccountId;
  const paymentAmount = createCreditAmount(accountType, totalAmount);

  if (paymentAccountHasChanged) {
    /**
     * change the entries details and update associated accounts
     */
    console.log("account has changed");
    changeEntriesAccount(
      transaction,
      userProfile,
      orgId,
      currentExpense.paymentAccount,
      depositAccount,
      paymentAccountEntries.map((entry) => {
        const { credit, debit, entryId, account } = entry;
        const prevEntry = { credit, debit, entryId };

        return {
          amount: paymentAmount,
          prevAccount: account,
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
    if (totalAmount !== currentTotal || vendorHasChanged) {
      console.log("normal update");
      updateSimilarAccountEntries(
        transaction,
        userProfile,
        orgId,
        depositAccount,
        paymentAccountEntries.map((entry) => {
          const { entryId, credit, debit, account } = entry;

          return {
            amount: paymentAmount,
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
  if (currentPaymentModeId === paymentModeId) {
    if (currentTotal !== totalAmount) {
      /**
       * create adjustment by subtracting current amount from incoming amount
       */
      let modeAdjustment = totalAmount - currentTotal;
      //subtract from zero to negate the values since they are supposed 2B subtracted
      modeAdjustment = 0 - modeAdjustment;
      updatePaymentMode(transaction, orgId, paymentModeId, modeAdjustment);
    }
  } else {
    /**
     * payment modes are not the same
     * subtract from zero to negate the values since they are supposed 2B subtracted
     */
    changePaymentMode(
      transaction,
      orgId,
      {
        amount: 0 - currentTotal,
        paymentModeId: currentPaymentModeId,
      },
      { amount: 0 - totalAmount, paymentModeId }
    );
  }
  /**
   * update vendor summaries
   */
  const newVendorRef = vendorId
    ? doc(db, "organizations", orgId, "vendors", vendorId)
    : null;
  const currentVendorRef = currentVendorId
    ? doc(db, "organizations", orgId, "vendors", currentVendorId)
    : null;
  /**
   * opening balance is strictly tied to a vendor.
   * cant change hence no need to change anything
   */
  if (vendorHasChanged) {
    //delete values from previous vendor
    if (currentVendorRef) {
      transaction.update(currentVendorRef, {
        "summary.totalExpenses": increment(0 - currentTotal),
        "summary.deletedExpenses": increment(1),
      });
    }
    if (newVendorRef) {
      //add new values to the incoming vendor
      transaction.update(newVendorRef, {
        "summary.totalExpenses": increment(totalAmount),
        "summary.expenses": increment(1),
      });
    }
  } else {
    if (currentVendorRef) {
      if (currentTotal !== totalAmount) {
        const adjustment = totalAmount - currentTotal;
        //update vendor summaries
        transaction.update(currentVendorRef, {
          "summary.totalExpenses": increment(adjustment),
        });
      }
    }
  }
  /**
   * update expense
   */
  const expenseRef = doc(db, "organizations", orgId, "expenses", expenseId);
  // console.log({ tDetails });
  transaction.update(expenseRef, {
    ...tDetails,
    // classical: "plus",
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
