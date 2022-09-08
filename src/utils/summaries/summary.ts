import {
  Transaction,
  FieldValue,
  DocumentReference,
  DocumentData,
  increment,
  doc,
  serverTimestamp,
  getDocs,
  query,
  collection,
  orderBy,
  limit,
  setDoc,
} from 'firebase/firestore';

import { db } from '../firebase';
import { getDateDetails, isSameDay, confirmFutureDate } from '../dates';

import { Org } from 'types';

interface AggregationData {
  [key: string]: number | FieldValue;
}

export default class Aggregation {
  data: AggregationData;
  transaction: Transaction;
  org: Org;

  summaryRef: DocumentReference<DocumentData>;

  constructor(
    transaction: Transaction,
    initialData: AggregationData | null,
    org: Org
  ) {
    this.data = initialData || {};
    this.transaction = transaction;
    this.org = org;

    const { yearMonthDay } = getDateDetails();
    this.summaryRef = doc(
      db,
      'organizations',
      org.orgId,
      'summaries',
      yearMonthDay
    );
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

  updateSummary() {
    const { data, summaryRef } = this;
    const dataIsEmpty = !data || Object.keys(data).length === 0;
    if (dataIsEmpty) {
      throw new Error('cannot update summary without data');
    }

    this.transaction.update(summaryRef, {
      ...data,
    });
  }

  async fetchSummaryData(date: Date = new Date()) {
    const {
      transaction,
      org: { orgId },
    } = this;

    const { yearMonthDay } = getDateDetails(date);
    const docRef = doc(db, 'organizations', orgId, 'summaries', yearMonthDay);

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

  //----------------------------------------------------------------\
  //static methods
  //----------------------------------------------------------------
  static async createMonthlySummary(orgId: string) {
    const q = query(
      collection(db, 'organizations', orgId, 'summaries'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      throw new Error('Something went wrong! Summary not found!');
    }

    const summaryDoc = snap.docs[0];
    const summaryData = summaryDoc.data();
    const summaryId = summaryDoc.id;
    const docDate = new Date(summaryId);
    const today = new Date();

    const isFutureDate = confirmFutureDate(docDate);
    console.log({ isFutureDate });

    if (!isFutureDate) {
      throw new Error(
        'Cannot update past summaries. Please check that your Devices calender is in sync. '
      );
    }

    if (isSameDay(docDate, today)) {
      /**
       * this is todays summary.
       * do nothing
       */
      return;
    }
    /**
     * generate new summary id
     */
    const { yearMonth } = getDateDetails();
    /**
     * create new summary for the month using previous month data
     */
    await setDoc(doc(db, 'organizations', orgId, 'summaries', yearMonth), {
      ...summaryData,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });
  }
}
