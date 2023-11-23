import { IAccount } from '../../types/account';

export default function getAccountData(
  accountId: string,
  accounts: IAccount[]
) {
  const found = accounts.find(account => account.accountId === accountId);
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
