import { doc, serverTimestamp, increment } from "firebase/firestore";
import { db } from "../firebase";

export default function deleteEntry(
  transaction,
  userProfile = { email: "" },
  orgId,
  entryId,
  accountId,
  accountSummaryAdjustment
) {
  const accountRef = doc(db, "organizations", orgId, "accounts", accountId);
  const entryRef = doc(db, "organizations", orgId, "journals", entryId);
  const { email } = userProfile;

  transaction.update(accountRef, {
    amount: increment(accountSummaryAdjustment),
  });

  transaction.update(entryRef, {
    status: "deleted",
    modifiedAt: serverTimestamp(),
    modifiedBy: email,
  });
}
