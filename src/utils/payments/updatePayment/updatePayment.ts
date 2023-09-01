import {
  doc,
  increment,
  serverTimestamp,
  Transaction,
} from 'firebase/firestore';

import {
  deleteSimilarAccountEntries,
  updateSimilarAccountEntries,
  changeEntriesAccount,
} from '../../journals';
import {
  updateCustomersPayments,
  updateInvoicesPayments,
  payInvoices,
  deleteInvoicesPayments,
  overPay,
} from '..';
import { getAccountData } from '../../accounts';
import { changePaymentMode, updatePaymentMode } from '../../summaries';
import { getDateDetails } from '../../dates';

import { db } from '../../firebase';

import { UserProfile, Account, PaymentReceivedForm } from '../../../types';
import { UpdateData } from '.';

export default function updatePayment(
  transaction: Transaction,
  orgId: string,
  userProfile: UserProfile,
  paymentId: string,
  formData: PaymentReceivedForm,
  updateData: UpdateData,
  accounts: Account[]
) {
  const { email } = userProfile;
  console.log({ formData });
  const {
    payments,
    // paidInvoices,
    amount,
    account,
    reference,
    paymentMode,
    customer,
  } = formData;
  const { accountId } = account;
  const { id: customerId } = customer;
  const { value: paymentModeId } = paymentMode;
  //extract update Data
  const {
    accountsReceivableEntriesToDelete,
    accountsReceivableEntriesToUpdate,
    currentPayment,
    overPayEntry,
    paymentAccountEntriesToDelete,
    paymentAccountEntriesToUpdate,
    paymentsToCreate,
    paymentsToDelete,
    paymentsToUpdate,
    paymentsTotal,
  } = updateData;
  /**
   * compute excess amount if any
   */
  const excess = amount - paymentsTotal;

  //accounts data
  const accounts_receivable = getAccountData('accounts_receivable', accounts);
  const depositAccount = getAccountData(accountId, accounts);
  const {
    customer: { id: currentCustomerId },
    account: { accountId: currentAccountId },
    paymentMode: { value: currentPaymentModeId },
    amount: currentAmount,
  } = currentPayment;
  /**
   * check if the customer has changed.
   */
  const customerHasChanged = customerId !== currentCustomerId;
  if (customerHasChanged) {
    console.log('customer has changed');
  }
  /**
   * check if payment account has been changed
   */
  const paymentAccountHasChanged = accountId !== currentAccountId;

  const transactionDetails = {
    ...formData,
    paymentId,
  };
  /**
   * update customers
   * function also handles a change of customer situation.
   */
  updateCustomersPayments(
    transaction,
    orgId,
    userProfile,
    currentPayment,
    formData
  );
  /**
   * update invoices
   * 1. update the necessary invoice payments
   * 2. updates accountsReceivableEntries for the updated payments
   * 3. updates paymentAccount entries fro the same
   */
  updateInvoicesPayments(transaction, userProfile, orgId, paymentId, [
    ...paymentsToUpdate,
  ]);
  /**2
   * update accounts receivable entries
   * they are not factored in if deposit account has changed
   * NOTE:::pass income as a negative value to be credited
   */
  updateSimilarAccountEntries(
    transaction,
    userProfile,
    orgId,
    accounts_receivable,
    accountsReceivableEntriesToUpdate.map(entry => {
      if (!entry.entry) {
        throw new Error('Entry data not found');
      }
      const {
        incoming,
        entry: { credit, debit, entryId },
        invoiceId,
      } = entry;

      return {
        account: accounts_receivable,
        amount: 0 - incoming,
        credit,
        debit,
        entryId,
        transactionId: invoiceId,
        transactionDetails: { ...transactionDetails },
      };
    })
  );
  /**3
   * check is paymentAccountId has changed
   */
  if (paymentAccountHasChanged) {
    /**
     * change the entries details and update associated accounts
     */
    console.log('account has changed');
    changeEntriesAccount(
      transaction,
      userProfile,
      orgId,
      currentPayment.account,
      depositAccount,
      paymentAccountEntriesToUpdate.map(entry => {
        if (!entry.entry) {
          throw new Error('Entry data not found');
        }
        const { invoiceId, incoming } = entry;
        return {
          amount: incoming,
          prevAccount: currentPayment.account,
          prevEntry: entry.entry,
          transactionDetails: { ...transactionDetails },
          transactionId: invoiceId,
          reference,
        };
      })
    );
  } else {
    /**
     * do a normal update
     */
    console.log('normal update');
    updateSimilarAccountEntries(
      transaction,
      userProfile,
      orgId,
      depositAccount,
      paymentAccountEntriesToUpdate.map(entry => {
        if (!entry.entry) {
          throw new Error('Entry data not found');
        }
        const {
          entry: { credit, debit, entryId },
          incoming,
          invoiceId,
        } = entry;
        return {
          account: depositAccount,
          amount: incoming,
          credit,
          debit,
          entryId,
          transactionId: invoiceId,
          transactionDetails: { ...transactionDetails },
        };
      })
    );
  }
  /**
   * create new invoice payments if any
   * the function also creates all the necessary journal entries
   */
  if (paymentsToCreate.length > 0) {
    console.log('creating payments');
    payInvoices(
      transaction,
      userProfile,
      orgId,
      transactionDetails,
      paymentsToCreate,
      accounts
    );
  }
  /**
   * delete deleted payments
   * 1. delete payments in invoices
   * 2. delete paymentAccount entries
   * 3. delete accountsReceivable entries
   */
  if (paymentsToDelete.length > 0) {
    console.log('deleting payments');
    deleteInvoicesPayments(
      transaction,
      userProfile,
      orgId,
      currentPayment,
      paymentsToDelete
    );
  }
  /**
   * delete paymentAccountEntries for deleted invoices payments
   */
  if (paymentAccountEntriesToDelete.length > 0) {
    console.log('deleting deposit account entries');

    deleteSimilarAccountEntries(
      transaction,
      userProfile,
      orgId,
      currentPayment.account,
      paymentAccountEntriesToDelete.map(entry => {
        if (!entry.entry) {
          throw new Error('Entry data not found');
        }
        const {
          entry: { credit, debit, entryId },
        } = entry;
        return {
          account: currentPayment.account,
          credit,
          debit,
          entryId,
        };
      })
    );
  }

  /**
   * delete accounts_receivable entries for deleted invoice payments
   */
  if (accountsReceivableEntriesToDelete.length > 0) {
    console.log('deleting accounts_receivebale entries');

    deleteSimilarAccountEntries(
      transaction,
      userProfile,
      orgId,
      accounts_receivable,
      accountsReceivableEntriesToDelete.map(entry => {
        if (!entry.entry) {
          throw new Error('Entry data not found');
        }
        const {
          entry: { credit, debit, entryId },
        } = entry;
        return {
          account: accounts_receivable,
          credit,
          debit,
          entryId,
        };
      })
    );
  }
  /**
   * excess amount - credit account with the excess amount
   */
  if (overPayEntry) {
    console.log('updating overpayment');

    overPay.updateEntry(
      transaction,
      userProfile,
      orgId,
      excess,
      transactionDetails,
      overPayEntry,
      accounts
    );
  } else {
    if (excess > 0) {
      console.log('creating overpayment');

      overPay.createEntry(
        transaction,
        userProfile,
        orgId,
        excess,
        transactionDetails,
        accounts
      );
    }
  }
  /**
   * update summary payment modes
   * if mode has changed, change the mode values
   */
  if (currentPaymentModeId === paymentModeId) {
    if (currentPayment.amount !== amount) {
      /**
       * create adjustment by subtracting current amount from incoming amount
       */
      const modeAdjustment = amount - currentPayment.amount;
      updatePaymentMode(transaction, orgId, paymentModeId, modeAdjustment);
    }
  } else {
    /**
     * payment modes are not the same
     */
    changePaymentMode(
      transaction,
      orgId,
      { amount: currentAmount, paymentModeId: currentPaymentModeId },
      { amount, paymentModeId }
    );
  }
  /**
   * update summary
   */
  if (currentPayment.amount !== amount) {
    const { yearMonthDay } = getDateDetails();
    const summaryRef = doc(
      db,
      'organizations',
      orgId,
      'summaries',
      yearMonthDay
    );
    const adjustment = +amount - +currentPayment.amount;
    transaction.update(summaryRef, {
      'cashFlow.incoming': increment(adjustment),
    });
  }

  /**
   * update payment
   */

  // console.log({ transactionDetails });
  const newDetails = {
    ...formData,
    paidInvoicesIds: Object.keys(payments),
    excess,
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  };
  console.log({ newDetails });
  const paymentRef = doc(db, 'organizations', orgId, 'payments', paymentId);
  transaction.update(paymentRef, { ...newDetails });
}
