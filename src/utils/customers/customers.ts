import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
  Timestamp,
} from 'firebase/firestore';

import Summary from 'utils/summaries/summary';
import { dbCollections } from '../firebase';
import OpeningBalance from './openingBalance';
import formats from 'utils/formats';

import {
  Org,
  UserProfile,
  Account,
  CustomerFormData,
  Customer,
} from '../../types';

export default class Customers {
  transaction: Transaction;
  org: Org;
  userId: string;
  customerId: string;
  accounts: Account[];

  constructor(
    transaction: Transaction,
    org: Org,
    userId: string,
    accounts: Account[],
    customerId: string
  ) {
    this.transaction = transaction;
    this.org = org;
    this.userId = userId;
    this.customerId = customerId;
    this.accounts = accounts;
  }

  create(customerData: CustomerFormData) {
    const { org, userId, customerId, transaction, accounts } = this;
    const { orgId } = org;

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

    const ob = new OpeningBalance(transaction, {
      accounts,
      customerId,
      org,
      userId,
    });

    ob.create({
      amount: openingBalance,
      customer: formats.formatCustomerData(customer),
    });

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
}
