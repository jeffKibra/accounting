import { doc } from "firebase/firestore";

import { db } from "../firebase";
import { getDateDetails } from "../dates";

export default async function getSummaryData(
  transaction,
  orgId,
  date = new Date()
) {
  const { yearMonthDay } = getDateDetails(date);
  const docRef = doc(db, "organizations", orgId, "summaries", yearMonthDay);

  const summaryDoc = await transaction.get(docRef);

  if (!summaryDoc.exists) throw new Error("Summary data not found!");

  return summaryDoc.data();
}
