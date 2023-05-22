import { doc, Transaction } from 'firebase/firestore';
import { dbCollections } from '../firebase';

import { SalesReceipt } from '../../types';

export default async function getSalesReceiptData(
  transaction: Transaction,
  orgId: string,
  saleReceiptId: string
): Promise<SalesReceipt> {
  const salesReceiptsCollection = dbCollections(orgId).salesReceipts;
  const salesReceiptRef = doc(salesReceiptsCollection, saleReceiptId);
  const salesReceiptDoc = await transaction.get(salesReceiptRef);
  const salesReceiptData = salesReceiptDoc.data();

  if (
    !salesReceiptDoc.exists ||
    !salesReceiptData ||
    salesReceiptData.status === 'deleted'
  ) {
    throw new Error(`Sales Receipt with id ${saleReceiptId} not found!`);
  }

  return {
    ...salesReceiptData,
    saleReceiptId,
  };
}
