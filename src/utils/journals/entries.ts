import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

import { Entry } from "../../types";

export async function getCustomerEntryData(
  orgId: string,
  customerId: string,
  accountId: string,
  transactionId: string,
  transactionType: string,
  status: string = "active"
): Promise<Entry | null> {
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
    where("status", "==", status),
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
  const { credit, debit, account } = entryDoc.data();

  return {
    credit,
    debit,
    entryId,
    account,
  };
}
