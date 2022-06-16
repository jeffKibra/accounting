import { doc } from "firebase/firestore";
import { db } from "../firebase";

export default async function getCustomerData(transaction, orgId, customerId) {
  const customerRef = doc(db, "organizations", orgId, "customers", customerId);
  const customerDoc = await transaction.get(customerRef);
  const data = customerDoc.data();

  if (!customerDoc.exists || data?.status === "deleted") {
    throw new Error(`Customer data with id ${customerId} not found!`);
  }

  return {
    ...data,
    customerId,
  };
}
