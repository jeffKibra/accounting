/**
 *
 * @typedef {import('.').account} account
 */
/**
 *
 * @param {string} accountId
 * @param {account[]} accounts
 * @returns {account} account
 */
export default function getAccountData(accountId = "", accounts = []) {
  console.log({ accountId, accounts });

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
