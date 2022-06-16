import { doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function deleteEntry(
  transaction,
  userProfile = { email: "" },
  orgId = "",
  entryId = ""
) {
  const entryRef = doc(db, "organizations", orgId, "journals", entryId);
  const { email } = userProfile;

  transaction.update(entryRef, {
    status: "deleted",
    modifiedAt: serverTimestamp(),
    modifiedBy: email,
  });
}
