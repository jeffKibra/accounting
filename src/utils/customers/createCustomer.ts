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

import { paymentModes } from '../../constants';

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

  const summaryData = {
    invoices: 0,
    deletedInvoices: 0,
    payments: 0,
    deletedPayments: 0,
    salesReceipts: 0,
    deletedSalesReceipts: 0,
    invoicesTotal: 0,
    paymentsTotal: 0,
    salesreceiptsTotal: 0,
    paymentModes: Object.keys(paymentModes).reduce((modes, key) => {
      return { ...modes, [key]: 0 };
    }, {}),
    accounts: Object.keys(accounts).reduce((accountsSummary, key) => {
      return {
        ...accountsSummary,
        [key]: 0,
      };
    }, {}),
    createdAt: serverTimestamp(),
    createdBy: userId,
    modifiedAt: serverTimestamp(),
    modifiedBy: userId,
  };

  /**
   * update org summary
   */
  const summaryRef = Summary.createOrgRef(orgId);
  transaction.update(summaryRef, {
    customers: increment(1),
  });
  //create customer summary
  const customerSummaryRef = Summary.createCustomerRef(orgId, customerId);
  transaction.set(customerSummaryRef, summaryData, { merge: true });
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
