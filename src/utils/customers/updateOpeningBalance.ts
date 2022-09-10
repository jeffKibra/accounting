import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
} from 'firebase/firestore';

import { db } from '../firebase';
import { getCustomerData, createOB, deleteOB, updateOB } from '.';

import { Org, Account, UserProfile, OpeningBalanceFormData } from '../../types';

export default async function updateOpeningBalance(
  transaction: Transaction,
  org: Org,
  userId: string,
  accounts: Account[],
  data: OpeningBalanceFormData
) {
  const { orgId } = org;
  const { openingBalance, customerId } = data;
  /**
   * check if incoming value is negative
   */
  if (openingBalance < 0) {
    throw new Error('Customer Opening balance should be greater than zero(0)!');
  }
  /**
   * fetch customer data
   */
  const customer = await getCustomerData(transaction, orgId, customerId);
  const { openingBalance: currentOB } = customer;
  /**
   * check if the amounts are the same
   * dont proceed
   */
  if (currentOB === openingBalance) {
    return;
  }
  /**
   * fetch invoice and entries data
   */
  if (currentOB > 0 && openingBalance === 0) {
    /**
     * opening balance is set to zero(0)
     * delete opening balance
     */
    console.log('delete');

    await deleteOB(transaction, orgId, userId, accounts, customerId);
  } else if (currentOB === 0 && openingBalance > 0) {
    /**
     * check if this is a new OB, no previous opening balance
     * create opening balance
     */
    console.log('create');

    createOB(
      transaction,
      org,
      userId,
      accounts,
      customer.customerId,
      customer,
      openingBalance
    );
  } else {
    /**
     * opening balance has been updated but its not zero
     */
    console.log('update');
    await updateOB(
      transaction,
      orgId,
      userProfile,
      accounts,
      customer,
      openingBalance
    );
  }
  /**
   * compute summary adjustment
   */
  const adjustment = +openingBalance - +currentOB;
  /**
   * update customer opening balance
   * dont update customer summary. invoice manipulation will handle that
   */
  const customerRef = doc(db, 'organizations', orgId, 'customers', customerId);
  transaction.update(customerRef, {
    openingBalance,
    'summary.invoicedAmount': increment(adjustment),
    modifiedBy: userId,
    modifiedAt: serverTimestamp(),
  });
}
