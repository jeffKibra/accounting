import { doc, Transaction } from "firebase/firestore";
import { dbCollections } from "../firebase";

import { Expense } from "../../types";

export default async function getExpenseData(
  transaction: Transaction,
  orgId: string,
  expenseId: string
) {
  const expensesCollection = dbCollections(orgId).expenses;

  const expenseRef = doc(expensesCollection, expenseId);
  const expenseDoc = await transaction.get(expenseRef);
  const data = expenseDoc.data();

  if (!expenseDoc.exists || !data || data?.status === "deleted") {
    throw new Error(`Sales Receipt with id ${expenseId} not found!`);
  }

  const expenseData: Expense = {
    ...data,
    expenseId,
  };

  return expenseData;
}
