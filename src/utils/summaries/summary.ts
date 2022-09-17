import { Transaction, FieldValue, doc, WriteBatch } from 'firebase/firestore';

import { db } from '../firebase';

import SummaryData from './summaryData';

import { Account, DailySummary } from 'types';

import { getDateDetails } from '../dates';

interface AggregationData {
  [key: string]: number | FieldValue;
}

export default class Summary extends SummaryData {
  transaction: Transaction;
  orgId: string;

  constructor(transaction: Transaction, orgId: string, accounts: Account[]) {
    super(accounts);

    this.transaction = transaction;
    this.orgId = orgId;
  }

  fetchCustomerSummary(orgId: string, customerId: string, yearMonth: string) {
    const docPath = `organizations/${orgId}/customers/${customerId}/summaries/${yearMonth}`;

    return this.fetchSummaryData(docPath);
  }

  fetchOrgSummary(orgId: string, yearMonth: string) {
    const docPath = `organizations/${orgId}/summaries/${yearMonth}`;

    return this.fetchSummaryData(docPath);
  }

  async fetchSummaryData(docPath: string) {
    const { transaction } = this;

    const docRef = doc(db, docPath);

    const summaryDoc = await transaction.get(docRef);

    if (!summaryDoc.exists) throw new Error('Summary data not found!');

    const data = summaryDoc.data();

    let summaryData: AggregationData;
    summaryData = {
      accounts: data?.accounts || {},
      cashFlow: data?.cashFlow || {},
      customers: data?.customers || 0,
      deletedInvoices: data?.deletedInvoices || 0,
      deletedPayments: data?.deletedPayments || 0,
      expenses: data?.expenses || 0,
      invoices: data?.invoices || 0,
      payments: data?.payments || 0,
      invoicesTotal: data?.invoicesTotal || 0,
      items: data?.items || 0,
      paymentModes: data?.paymentModes || {},
      paymentsTotal: data?.paymentsTotal || 0,
      salesReceipts: data?.salesReceipts || 0,
      vendors: data?.vendors || 0,
    };

    return summaryData;
  }

  static createOrgRef(orgId: string) {
    return doc(db, 'organizations', orgId, 'summaries', 'aggregate');
  }

  createOrgSummary(batch: WriteBatch) {
    const { data, orgId } = this;
    const summaryRef = Summary.createOrgRef(orgId);

    const dataIsEmpty = !data || Object.keys(data).length === 0;
    if (dataIsEmpty) {
      throw new Error('cannot create summary without data');
    }

    batch.set(
      summaryRef,
      {
        ...data,
      },
      { merge: true }
    );
  }

  updateOrgSummary() {
    const { data, orgId } = this;
    const summaryRef = Summary.createOrgRef(orgId);

    const dataIsEmpty = !data || Object.keys(data).length === 0;
    if (dataIsEmpty) {
      throw new Error('cannot update summary without data');
    }

    this.transaction.update(summaryRef, {
      ...data,
    });
  }

  static createCustomerRef(orgId: string, customerId: string) {
    return doc(
      db,
      'organizations',
      orgId,
      'customers',
      customerId,
      'summaries',
      'aggregate'
    );
  }

  createCustomerSummary(batch: WriteBatch, customerId: string) {
    const { data, orgId } = this;

    const summaryRef = Summary.createCustomerRef(orgId, customerId);

    const dataIsEmpty = !data || Object.keys(data).length === 0;
    if (dataIsEmpty) {
      throw new Error('cannot create summary without data');
    }

    batch.set(
      summaryRef,
      {
        ...data,
      },
      { merge: true }
    );
  }

  updateCustomerSummary(customerId: string) {
    const { data, orgId } = this;

    const summaryRef = Summary.createCustomerRef(orgId, customerId);

    const dataIsEmpty = !data || Object.keys(data).length === 0;
    if (dataIsEmpty) {
      throw new Error('cannot update summary without data');
    }

    this.transaction.update(summaryRef, {
      ...data,
    });
  }
}
