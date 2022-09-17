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

import { Org, Account, CustomerFormData, Customer } from '../../types';

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

  async create(customerData: CustomerFormData) {
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

    const summary = new Summary(transaction, orgId, accounts);

    if (openingBalance > 0) {
      const invoiceId = await OpeningBalance.createInvoiceId(
        transaction,
        orgId,
        accounts
      );

      const ob = new OpeningBalance(transaction, {
        accounts,
        org,
        userId,
        invoiceId,
      });
      const invoiceForm = ob.generateInvoice(
        openingBalance,
        formats.formatCustomerData(customer)
      );
      //create opening balance
      ob.create(invoiceForm);

      const { salesAccount, OBAAccount } = ob;
      summary.debitAccount(salesAccount.accountId, openingBalance);
      summary.creditAccount(OBAAccount.accountId, openingBalance);
      summary.append('invoices', 1, 0);
    }
    console.log({ summary });

    const orgSummary = new Summary(transaction, orgId, accounts);
    orgSummary.data = summary.data;
    orgSummary.append('customers', 1, 0);

    const customerSummary = new Summary(transaction, orgId, accounts);
    customerSummary.data = summary.data;

    //update orgSummary
    orgSummary.updateOrgSummary();
    //update customer summary
    customerSummary.updateCustomerSummary(customerId);

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
