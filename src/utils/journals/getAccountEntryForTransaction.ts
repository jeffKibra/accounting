import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';

import { Entry, TransactionTypes } from '../../types';

export default async function getAccountEntryForTransaction(
  orgId: string,
  accountId: string,
  transactionId: string,
  transactionType: keyof TransactionTypes,
  status = 'active'
): Promise<Entry> {
  console.log({ accountId, transactionId, transactionType, status, orgId });
  const q = query(
    collection(db, 'organizations', orgId, 'journals'),
    orderBy('createdAt', 'desc'),
    where('account.accountId', '==', accountId),
    where('transactionId', '==', transactionId),
    where('transactionType', '==', transactionType),
    where('status', '==', status),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) {
    console.log('errors', {
      accountId,
      transactionId,
      transactionType,
      status,
      orgId,
    });

    throw new Error('Data inconsistencies detected!');
  }

  const entryDoc = snap.docs[0];
  const { credit, debit, account } = entryDoc.data();

  const entry = {
    debit,
    credit,
    account,
    entryId: entryDoc.id,
  };

  return entry;
}
