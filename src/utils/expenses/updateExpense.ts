import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
} from 'firebase/firestore';

import { db, dbCollections } from '../firebase';
import {
  updateSimilarAccountEntries,
  deleteSimilarAccountEntries,
  createSimilarAccountEntries,
  getAccountsEntriesForTransaction,
} from '../journals';

import { getAccountData, getAccountsMapping } from '../accounts';
import { changePaymentMode, updatePaymentMode } from '../summaries';
import { getExpenseData, getEntryAmount } from '.';
// import formats from '../formats';
import { getDateDetails } from '../dates';

import {
  UserProfile,
  Account,
  ExpenseFormData,
  ExpenseUpdateData,
} from '../../types';

interface ExpenseFormUpdate extends ExpenseFormData {
  expenseId: string;
}
interface TDetails
  extends Omit<
    ExpenseUpdateData,
    'modifiedBy' | 'modifiedAt' | 'status' | 'transactionType'
  > {
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
  const { totalTax, totalAmount } = summary;
  /**
   * check vendor
   */
  let vendorId = vendor?.id;
  /**
   * fetch current expense
   */
  const [currentExpense] = await Promise.all([
    getExpenseData(transaction, orgId, expenseId),
  ]);

  const {
    vendor: currentVendor,
    summary: { totalTax: currentTaxes, totalAmount: currentTotal },
    paymentAccount: { accountId: currentPaymentAccountId },
    paymentMode: { value: currentPaymentModeId },
  } = currentExpense;
  const currentVendorId = currentVendor?.id;

  /**
   * total amount adjustment
   */
  const adjustment = totalAmount - currentTotal;
  /**
   * check if vendor has been changed
   */
  console.log({ currentVendorId, vendorId });
  const vendorHasChanged = currentVendorId !== vendorId;

  const allCurrentItems = [
    ...currentExpense.items.map(item => {
      const {
        account: { accountId },
        itemRate,
      } = item;
      return { accountId, amount: itemRate };
    }),
    {
      accountId: 'tax_payable',
      amount: currentTaxes,
    },
    {
      accountId: currentPaymentAccountId,
      amount: currentTotal,
    },
  ];

  const allIncomingItems = [
    ...items.map(item => {
      const {
        account: { accountId },
        itemRate,
      } = item;
      return {
        accountId,
        amount: itemRate,
      };
    }),
    {
      accountId: 'tax_payable',
      amount: totalTax,
    },
    {
      accountId: paymentAccountId,
      amount: totalAmount,
    },
  ];

  const { deletedAccounts, newAccounts, updatedAccounts, similarAccounts } =
    getAccountsMapping(allCurrentItems, allIncomingItems);

  const accountsToUpdate = [...similarAccounts, ...updatedAccounts];
  /**
   * get entries data for deletedAccounts and accountsToUpdate
   */
  const [entriesToUpdate, entriesToDelete] = await Promise.all([
    getAccountsEntriesForTransaction(
      orgId,
      expenseId,
      'expense',
      accountsToUpdate
    ),
    getAccountsEntriesForTransaction(
      orgId,
      expenseId,
      'expense',
      deletedAccounts
    ),
  ]);
  //currentSummary

  const tDetails: TDetails = {
    ...rest,
    items: items,
  };
  /**
   * if vendor is not undefined, add it to tDetails
   */
  // if (vendor) {
  //   tDetails.vendor = formats.formatVendorData(vendor);
  // }

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
  entriesToUpdate.forEach(entry => {
    console.log({ entry });
    const { accountId, incoming, credit, debit, entryId } = entry;
    const entryAccount = getAccountData(accountId, accounts);

    const amount = getEntryAmount(incoming, entryAccount, paymentAccountId);
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
  entriesToDelete.forEach(entry => {
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
  newAccounts.forEach(incomeAccount => {
    const { accountId, incoming } = incomeAccount;
    const entryAccount = getAccountData(accountId, accounts);

    const amount = getEntryAmount(incoming, entryAccount, paymentAccountId);

    createSimilarAccountEntries(transaction, userProfile, orgId, entryAccount, [
      {
        amount,
        account: entryAccount,
        reference,
        transactionDetails,
        transactionId: expenseId,
        transactionType: 'expense',
      },
    ]);
  });

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
    ? doc(db, 'organizations', orgId, 'vendors', vendorId)
    : null;
  const currentVendorRef = currentVendorId
    ? doc(db, 'organizations', orgId, 'vendors', currentVendorId)
    : null;
  /**
   * opening balance is strictly tied to a vendor.
   * cant change hence no need to change anything
   */
  if (vendorHasChanged) {
    //delete values from previous vendor
    if (currentVendorRef) {
      transaction.update(currentVendorRef, {
        'summary.totalExpenses': increment(0 - currentTotal),
        'summary.deletedExpenses': increment(1),
      });
    }
    if (newVendorRef) {
      //add new values to the incoming vendor
      transaction.update(newVendorRef, {
        'summary.totalExpenses': increment(totalAmount),
        'summary.expenses': increment(1),
      });
    }
  } else {
    if (currentVendorRef) {
      if (currentTotal !== totalAmount) {
        const adjustment = totalAmount - currentTotal;
        //update vendor summaries
        transaction.update(currentVendorRef, {
          'summary.totalExpenses': increment(adjustment),
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
      'organizations',
      orgId,
      'summaries',
      yearMonthDay
    );
    const adjustment = totalAmount - currentTotal;
    transaction.update(summaryRef, {
      'cashFlow.outgoing': increment(adjustment),
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
    modifiedBy: email || '',
    modifiedAt: serverTimestamp(),
  });
}
