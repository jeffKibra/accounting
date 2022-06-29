import { doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 *
 * @typedef {import('firebase/firestore').Transaction} transaction
 */
/**
 *
 * @param {transaction} transaction
 * @param {{email:''}} userProfile
 * @param {string} orgId
 * @param {string} entryId
 * @param {string} deletionType
 */

export default function deleteEntry(
  transaction,
  userProfile,
  orgId,
  entryId,
  deletionType = "delete"
) {
  const entryRef = doc(db, "organizations", orgId, "journals", entryId);
  const { email } = userProfile;

  if (deletionType === "delete") {
    transaction.delete(entryRef);
  } else {
    transaction.update(entryRef, {
      status: "deleted",
      modifiedAt: serverTimestamp(),
      modifiedBy: email,
    });
  }
}
