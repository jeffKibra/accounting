import { doc } from "firebase/firestore";
import { db } from "../firebase";

export default async function getVendorData(transaction, orgId, vendorId) {
  const vendorRef = doc(db, "organizations", orgId, "vendors", vendorId);
  const vendorDoc = await transaction.get(vendorRef);
  const data = vendorDoc.data();

  if (!vendorDoc.exists || data?.status === "deleted") {
    throw new Error(`Vendor data with id ${vendorId} not found!`);
  }

  return {
    ...data,
    vendorId,
  };
}
