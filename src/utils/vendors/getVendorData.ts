import { doc, Transaction } from "firebase/firestore";
import { dbCollections } from "../firebase";

import { Vendor } from "../../types";

export default async function getVendorData(
  transaction: Transaction,
  orgId: string,
  vendorId: string
) {
  const vendorsCollection = dbCollections(orgId).vendors;
  const vendorRef = doc(vendorsCollection, vendorId);
  const vendorDoc = await transaction.get(vendorRef);
  const data = vendorDoc.data();

  if (!vendorDoc.exists || !data || data?.status === "deleted") {
    throw new Error(`Vendor data with id ${vendorId} not found!`);
  }

  const vendorData: Vendor = {
    ...data,
    vendorId,
  };

  return vendorData;
}
