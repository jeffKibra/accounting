import { Account } from "../../types/accounts";

export default function getAccountData(accountId: string, accounts: Account[]) {
  const found = accounts.find((account) => account.accountId === accountId);
  if (!found) {
    throw new Error(`Account data with id ${accountId} not found!`);
  }
  const { accountType, name } = found;
  return {
    name,
    accountId,
    accountType,
  };
}
