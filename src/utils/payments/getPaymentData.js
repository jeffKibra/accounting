import { doc } from "firebase/firestore";
import { db } from "../firebase";

export default async function getPaymentData(transaction, orgId, paymentId) {
  const paymentRef = doc(db, "organizations", orgId, "payments", paymentId);
  const paymentDoc = await transaction.get(paymentRef);
  const data = paymentDoc.data();

  if (!paymentDoc.exists || data?.status === "deleted") {
    throw new Error(`Payment data with id ${paymentId} not found!`);
  }

  return {
    ...data,
    paymentId,
  };
}
