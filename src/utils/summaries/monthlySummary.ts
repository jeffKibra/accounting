import { Transaction, increment, FieldValue, doc } from 'firebase/firestore';

import { db } from '../firebase';

interface AggregationData {
  [key: string]: number | FieldValue;
}

export default class MonthlySummary {
  data: AggregationData;
  transaction: Transaction;
  orgId: string;

  constructor(transaction: Transaction, orgId: string) {
    this.data = {};
    this.transaction = transaction;

    this.orgId = orgId;
  }

  append(fieldName: string, incomingValue: number, currentValue?: number) {
    const prevValue = currentValue || 0;
    const adjustment = incomingValue - prevValue;

    this.data = {
      ...this.data,
      [fieldName]: increment(adjustment),
    };
  }

  appendObject(obj: { [key: string]: number | FieldValue }) {
    const { data } = this;
    if (data && typeof data === 'object') {
      this.data = { ...data, ...obj };
    } else {
      this.data = obj;
    }
  }

  appendPaymentMode(
    modeId: string,
    incomingValue: number,
    currentValue?: number
  ) {
    this.append(`paymentModes.${modeId}`, incomingValue, currentValue);
  }

  appendAccount(
    accountId: string,
    incomingValue: number,
    currentValue?: number
  ) {
    this.append(`accounts.${accountId}`, incomingValue, currentValue);
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

  updateOrgSummary() {
    const { data, orgId } = this;
    const summaryRef = doc(
      db,
      'organizations',
      orgId,
      'summaries',
      'aggregate'
    );

    const dataIsEmpty = !data || Object.keys(data).length === 0;
    if (dataIsEmpty) {
      throw new Error('cannot update summary without data');
    }

    this.transaction.update(summaryRef, {
      ...data,
    });
  }

  updateCustomerSummary(customerId: string) {
    const { data, orgId } = this;

    const summaryRef = doc(
      db,
      'organizations',
      orgId,
      'customers',
      customerId,
      'summaries',
      'aggregate'
    );

    const dataIsEmpty = !data || Object.keys(data).length === 0;
    if (dataIsEmpty) {
      throw new Error('cannot update summary without data');
    }

    this.transaction.update(summaryRef, {
      ...data,
    });
  }
}
