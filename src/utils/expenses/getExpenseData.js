import { doc } from "firebase/firestore";
import { db } from "../firebase";

export default async function getExpenseData(transaction, orgId, expenseId) {
  const expenseRef = doc(db, "organizations", orgId, "expenses", expenseId);
  const expenseDoc = await transaction.get(expenseRef);
  const expenseData = expenseDoc.data();

  if (!expenseDoc.exists || expenseData.status === "deleted") {
    throw new Error(`Sales Receipt with id ${expenseId} not found!`);
  }

  return {
    ...expenseData,
    expenseId,
  };
}
