import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
  Timestamp,
} from "firebase/firestore";

import { db, dbCollections } from "../firebase";
import { getDateDetails } from "../dates";
import { createOB } from ".";

import {
  Org,
  UserProfile,
  Account,
  CustomerFormData,
  Customer,
} from "../../types";

export default async function createCustomer(
  transaction: Transaction,
  org: Org,
  userProfile: UserProfile,
  accounts: Account[],
  customerId: string,
  customerData: CustomerFormData
) {
  const { orgId } = org;
  const { email } = userProfile;

  const { openingBalance } = customerData;

  const customerWithId = {
    ...customerData,
    customerId,
  };

  const customer: Customer = {
    ...customerWithId,
    status: "active",
    summary: {
      invoices: 0,
      deletedInvoices: 0,
      payments: 0,
      deletedPayments: 0,
      unusedCredits: 0,
      invoicedAmount: openingBalance,
      invoicePayments: 0,
    },
    createdBy: email,
    createdAt: serverTimestamp() as Timestamp,
    modifiedBy: email,
    modifiedAt: serverTimestamp() as Timestamp,
  };

  /**
   * if opening balance is greater than zero
   * create journal entries and an equivalent invoice
   */
  if (openingBalance > 0) {
    /**
     * create opening balance
     */
    createOB(transaction, org, userProfile, accounts, customer, openingBalance);
  }
  /**
   * update org summary
   */
  const { yearMonthDay } = getDateDetails();
  const summaryRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);
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
