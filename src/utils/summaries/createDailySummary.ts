import {
  collection,
  getDocs,
  query,
  limit,
  orderBy,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";
import { confirmFutureDate, getDateDetails, isSameDay } from "../dates";

export default async function createDailySummary(orgId: string) {
  const q = query(
    collection(db, "organizations", orgId, "summaries"),
    orderBy("createdAt", "desc"),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    throw new Error("Something went wrong! Summary not found!");
  }
  const summaryDoc = snap.docs[0];
  const summaryData = summaryDoc.data();
  const summaryId = summaryDoc.id;
  const docDate = new Date(summaryId);
  const today = new Date();

  const isFutureDate = confirmFutureDate(docDate);
  console.log({ isFutureDate });

  if (!isFutureDate) {
    throw new Error(
      "Cannot update past summaries. Please check that your Devices calender is in sync. "
    );
  }

  if (isSameDay(docDate, today)) {
    /**
     * this is todays summary.
     * do nothing
     */
    return;
  }
  /**
   * generate new summary id
   */
  const { yearMonthDay } = getDateDetails();
  /**
   * create new summary for the day using previous day data
   */
  await setDoc(doc(db, "organizations", orgId, "summaries", yearMonthDay), {
    ...summaryData,
    createdAt: serverTimestamp(),
    modifiedAt: serverTimestamp(),
  });
}
