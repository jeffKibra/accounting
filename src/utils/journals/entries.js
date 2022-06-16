import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

export async function getCustomerEntryData(
  orgId = "",
  customerId = "",
  accountId = "",
  transactionId = "",
  transactionType = "",
  statuses = ["active"]
) {
  // console.log({
  //   transactionType,
  //   orgId,
  //   accountId,
  //   customerId,
  //   transactionId,
  //   statuses,
  // });
  const q = query(
    collection(db, "organizations", orgId, "journals"),
    orderBy("createdAt", "desc"),
    where("transactionDetails.customerId", "==", customerId),
    where("transactionId", "==", transactionId),
    where("account.accountId", "==", accountId),
    where("transactionType", "==", transactionType),
    where("status", "in", statuses),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) {
    // throw new Error(`Customer entry data not found! Entry data:{
    //   customerId:${customerId},
    //   transactionId:${transactionId},
    //   accountId:${accountId},
    //   TransactionType:${transactionType},
    //   status:${status}
    // }`);
    return null;
  }

  const entryDoc = snap.docs[0];
  const entryId = entryDoc.id;
  const { credit, debit, status } = entryDoc.data();

  return {
    credit,
    debit,
    entryId,
    status,
  };
}
