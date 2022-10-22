import { doc, Transaction } from 'firebase/firestore';

import { db } from '../firebase';
import { getDateDetails } from '../dates';

import { DailySummary } from '../../types';

export default async function getSummaryData(
  transaction: Transaction,
  orgId: string,
  date: Date = new Date()
) {
  const { yearMonthDay } = getDateDetails(date);
  const docRef = doc(db, 'organizations', orgId, 'summaries', yearMonthDay);

  const summaryDoc = await transaction.get(docRef);

  if (!summaryDoc.exists) throw new Error('Summary data not found!');

  const data = summaryDoc.data();

  let summaryData: DailySummary;
  summaryData = {
    accounts: data?.accounts || {},
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
