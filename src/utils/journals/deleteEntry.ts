import { doc, serverTimestamp, Transaction } from "firebase/firestore";
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

import { UserProfile } from "../../types";

export default function deleteEntry(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  entryId: string,
  deletionType: string = "delete"
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
