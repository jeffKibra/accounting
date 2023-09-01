import { Transaction } from 'firebase/firestore';

import {
  getPaymentsTotal,
  getPaymentData,
  getPaymentEntriesToUpdate,
  getPaymentsMapping,
  getPaymentEntry,
} from '..';
import { getAccountData } from '../../accounts';
import { createDailySummary } from '../../summaries';

import { Account, PaymentReceivedForm } from '../../../types';

export default async function updatePayment(
  transaction: Transaction,
  orgId: string,
  accounts: Account[],
  paymentId: string,
  formData: PaymentReceivedForm
) {
  console.log({ formData });
  const {
    payments,
    // paidInvoices,
    amount,
    account,
    customer,
  } = formData;
  const { accountId } = account;
  const { id: customerId } = customer;
  /**
   * get payments total
   */
  const paymentsTotal = getPaymentsTotal(payments);
  if (paymentsTotal > amount) {
    throw new Error('Invoices payments cannot be more than customer payment!');
  }

  //accounts data
  const unearned_revenue = getAccountData('unearned_revenue', accounts);
  const accounts_receivable = getAccountData('accounts_receivable', accounts);

  /**
   * get current currentPayment and incoming customer details
   * create daily summary since all updates also update the summary
   */
  const [currentPayment] = await Promise.all([
    getPaymentData(transaction, orgId, paymentId),
    createDailySummary(orgId),
  ]);
  const {
    customer: { id: currentCustomerId },
    account: { accountId: currentAccountId },
  } = currentPayment;
  /**
   * check if the customer has changed. if yes
   * generate new payment number and slug
   */
  const customerHasChanged = customerId !== currentCustomerId;

  if (customerHasChanged) {
    console.log('customer has changed');
  }
  /**
   * check if payment account has been changed
   */
  const paymentAccountHasChanged = accountId !== currentAccountId;

  const {
    similarPayments,
    paymentsToUpdate,
    paymentsToCreate,
    paymentsToDelete,
  } = getPaymentsMapping(currentPayment.payments, payments);
  console.log({
    similarPayments,
    paymentsToUpdate,
    paymentsToCreate,
    paymentsToDelete,
  });
  /**
   * create two different update values based on the accounts:
   * 1. accountsReceivable account
   * 2. deposit account
   * if either customer or deposit account has changed:
   * values include paymentsToUpdate and similarPayments
   * else, paymentsToUpdate only
   */
  const accountsReceivablePaymentsToUpdate = customerHasChanged
    ? [...paymentsToUpdate, ...similarPayments]
    : paymentsToUpdate;
  const accountPaymentsToUpdate =
    customerHasChanged || paymentAccountHasChanged
      ? [...paymentsToUpdate, ...similarPayments]
      : paymentsToUpdate;
  /**
   * divide the payments entries into:
   * 1. accounts_receivable account
   * 2. selected paymentAccount
   * get entries for each payments that needs updating
   */
  const [
    paymentAccountEntriesToUpdate,
    paymentAccountEntriesToDelete,
    accountsReceivableEntriesToUpdate,
    accountsReceivableEntriesToDelete,
    overPayEntry,
  ] = await Promise.all([
    getPaymentEntriesToUpdate(
      orgId,
      paymentId,
      currentAccountId, //use current payment accountId
      [...accountPaymentsToUpdate]
    ),
    getPaymentEntriesToUpdate(orgId, paymentId, currentAccountId, [
      ...paymentsToDelete,
    ]),
    getPaymentEntriesToUpdate(orgId, paymentId, accounts_receivable.accountId, [
      ...accountsReceivablePaymentsToUpdate,
    ]),
    getPaymentEntriesToUpdate(orgId, paymentId, accounts_receivable.accountId, [
      ...paymentsToDelete,
    ]),
    getPaymentEntry(orgId, paymentId, unearned_revenue.accountId, paymentId),
  ]);

  console.log({
    paymentAccountEntriesToUpdate,
    paymentAccountEntriesToDelete,
    accountsReceivableEntriesToUpdate,
    accountsReceivableEntriesToDelete,
    overPayEntry,
  });

  return {
    paymentAccountEntriesToUpdate,
    paymentAccountEntriesToDelete,
    accountsReceivableEntriesToUpdate,
    accountsReceivableEntriesToDelete,
    overPayEntry,
    paymentsToCreate,
    paymentsToUpdate,
    paymentsToDelete,
    currentPayment,
    paymentsTotal,
  };
}
