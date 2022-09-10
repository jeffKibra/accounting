import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
  Timestamp,
} from 'firebase/firestore';

import Summary from 'utils/summaries/summary';
import { dbCollections } from '../firebase';
import { createOB } from '.';

import {
  Org,
  UserProfile,
  Account,
  CustomerFormData,
  Customer,
} from '../../types';

export default async function createCustomer(
  transaction: Transaction,
  org: Org,
  userProfile: UserProfile,
  accounts: Account[],
  customerId: string,
  customerData: CustomerFormData
) {
  const { orgId } = org;
  const { uid: userId } = userProfile;

  const { openingBalance } = customerData;

  const customerWithId = {
    ...customerData,
    customerId,
  };

  const customer: Customer = {
    ...customerWithId,
    status: 'active',
    createdBy: userId,
    createdAt: serverTimestamp() as Timestamp,
    modifiedBy: userId,
    modifiedAt: serverTimestamp() as Timestamp,
  };

  if (openingBalance > 0) {
    /**
     * create opening balance
     */
    createOB(
      transaction,
      org,
      userId,
      accounts,
      customerId,
      customerData,
      openingBalance
    );
  }

  /**
   * update org summary
   */
  const summaryRef = Summary.createOrgRef(orgId);
  transaction.update(summaryRef, {
    customers: increment(1),
  });

  /**
   * create customer
   */
  const customersCollection = dbCollections(orgId).customers;
  const customerRef = doc(customersCollection, customerId);

  const { customerId: cid, ...tDetails } = customer;
  transaction.set(customerRef, {
    ...tDetails,
  });
}
