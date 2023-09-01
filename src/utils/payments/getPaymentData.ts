import { doc, Transaction } from "firebase/firestore";
import { dbCollections } from "../firebase";

import { PaymentReceived } from "../../types";

export default async function getPaymentData(
  transaction: Transaction,
  orgId: string,
  paymentId: string
) {
  const paymentsCollection = dbCollections(orgId).paymentsReceived;
  const paymentRef = doc(paymentsCollection, paymentId);
  const paymentDoc = await transaction.get(paymentRef);
  const data = paymentDoc.data();

  if (!paymentDoc.exists || !data || data?.status === "deleted") {
    throw new Error(`Payment data with id ${paymentId} not found!`);
  }

  const paymentData: PaymentReceived = {
    ...data,
    paymentId,
  };

  return paymentData;
}
