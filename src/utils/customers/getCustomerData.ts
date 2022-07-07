import { doc, Transaction } from "firebase/firestore";
import { dbCollections } from "../firebase";

import { Customer } from "../../types";

export default async function getCustomerData(
  transaction: Transaction,
  orgId: string,
  customerId: string
) {
  const customersCollection = dbCollections(orgId).customers;
  const customerRef = doc(customersCollection, customerId);
  const customerDoc = await transaction.get(customerRef);
  const data = customerDoc.data();

  if (!customerDoc.exists || data === undefined || data?.status === "deleted") {
    throw new Error(`Customer data with id ${customerId} not found!`);
  }

  let customerData: Customer = {
    ...data,
    customerId,
  };

  return customerData;
}
