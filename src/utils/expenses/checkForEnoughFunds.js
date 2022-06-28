import { getSummaryData } from "../summaries";

export default async function checkForEnoughFunds(
  transaction,
  orgId,
  accountId,
  paymentModeId,
  amount
) {
  const summary = await getSummaryData(transaction, orgId);
  if (summary?.accounts[accountId] < amount) {
    throw new Error(
      `The selected payment account has insufficient funds for this expense!`
    );
  }
  if (summary?.paymentModes[paymentModeId] < amount) {
    throw new Error(
      `The selected payment account has insufficient funds for this expense!`
    );
  }
}
