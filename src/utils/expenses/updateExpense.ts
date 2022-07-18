import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
} from "firebase/firestore";

import { db, dbCollections } from "../firebase";
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
import { getDateDetails } from "../dates";

import {
  UserProfile,
  Account,
  ExpenseFormData,
  ExpenseUpdateData,
} from "../../types";

interface ExpenseFormUpdate extends ExpenseFormData {
  expenseId: string;
}
interface TDetails
  extends Omit<ExpenseUpdateData, "modifiedBy" | "modifiedAt" | "status"> {
  status?: string;
}

export default async function updateExpense(
  transaction: Transaction,
  orgId: string,
  userProfile: UserProfile,
  accounts: Account[],
  data: ExpenseFormUpdate
) {
  const { email } = userProfile;
  const { expenseId, ...rest } = data;
  //create a copy of the vendor
  const vendor = { ...rest }.vendor;
  //delete the vendor field in object
  delete rest.vendor;

  const { summary, items, paymentAccount, paymentMode, reference } = rest;
  console.log({ data });
  const { accountId: paymentAccountId } = paymentAccount;
  const { value: paymentModeId } = paymentMode;
  const { totalTaxes, totalAmount } = summary;
  /**
   * check vendor
   */
  let vendorId = vendor?.vendorId;
  /**
   * fetch current expense
   */
  const [currentExpense] = await Promise.all([
    getExpenseData(transaction, orgId, expenseId),
  ]);

  const {
    vendor: currentVendor,
    items: currentItems,
    summary: { totalTaxes: currentTaxes, totalAmount: currentTotal },
    paymentAccount: { accountId: currentPaymentAccountId },
    paymentMode: { value: currentPaymentModeId },
  } = currentExpense;
  const currentVendorId = currentVendor?.vendorId;
  /**
   * total amount adjustment
   */
  const adjustment = totalAmount - currentTotal;
  /**
   * check if vendor has been changed
   */
  console.log({ currentVendorId, vendorId });
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

  const tDetails: TDetails = {
    ...rest,
    items: formats.formatExpenseItems(items),
  };
  /**
   * if vendor is not undefined, add it to tDetails
   */
  if (vendor) {
    tDetails.vendor = formats.formatVendorData(vendor);
  }

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
        const { account } = entry;

        return {
          amount: paymentAmount,
          prevAccount: account,
          prevEntry: entry,
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
      //subtract from zero to negate the values since they are supposed 2B subtracted
      const modeAdjustment = 0 - adjustment;
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
   * update org summaries
   */
  if (currentTotal !== totalAmount) {
    const { yearMonthDay } = getDateDetails();
    const summaryRef = doc(
      db,
      "organizations",
      orgId,
      "summaries",
      yearMonthDay
    );
    const adjustment = totalAmount - currentTotal;
    transaction.update(summaryRef, {
      "cashFlow.outgoing": increment(adjustment),
    });
  }

  /**
   * update expense
   */
  const expensesCollection = dbCollections(orgId).expenses;
  const expenseRef = doc(expensesCollection, expenseId);
  console.log({ tDetails });
  transaction.update(expenseRef, {
    ...tDetails,
    // classical: "plus",
    modifiedBy: email || "",
    modifiedAt: serverTimestamp(),
  });
}
