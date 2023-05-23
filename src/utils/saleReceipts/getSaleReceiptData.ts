import { doc, Transaction } from 'firebase/firestore';
import { dbCollections } from '../firebase';

import { SaleReceipt } from '../../types';

export default async function getSaleReceiptData(
  transaction: Transaction,
  orgId: string,
  saleReceiptId: string
): Promise<SaleReceipt> {
  const saleReceiptsCollection = dbCollections(orgId).saleReceipts;
  const saleReceiptRef = doc(saleReceiptsCollection, saleReceiptId);
  const saleReceiptDoc = await transaction.get(saleReceiptRef);
  const saleReceiptData = saleReceiptDoc.data();

  if (
    !saleReceiptDoc.exists ||
    !saleReceiptData ||
    saleReceiptData.status === 'deleted'
  ) {
    throw new Error(`Sales Receipt with id ${saleReceiptId} not found!`);
  }

  return {
    ...saleReceiptData,
    saleReceiptId,
  };
}
