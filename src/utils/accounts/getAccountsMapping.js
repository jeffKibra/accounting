/**
 * @typedef {Object} account
 * @property {number} current
 * @property {number} incoming
 * @property {string} accountId
 */
/**
 * @typedef {account[]} accountsData
 */
/**
 * @param {account[]} accounts
 * @returns {{newAccounts:accountsData,updatedAccounts:accountsData,deletedAccounts:accountsData,similarAccounts:accountsData}} accountsMapping
 */

function getAccountsMapping(
  accounts = [{ current: 0, incoming: 0, accountId: "" }]
) {
  let newAccounts = [];
  let updatedAccounts = [];
  let deletedAccounts = [];
  let similarAccounts = [];

  accounts.forEach((account) => {
    const { current, incoming } = account;

    if (current === incoming) {
      similarAccounts.push({ ...account });
    } else {
      if (current === 0) {
        newAccounts.push({ ...account });
      } else if (incoming === 0) {
        deletedAccounts.push({ ...account });
      } else {
        updatedAccounts.push({ ...account });
      }
    }
  });
  similarAccounts = similarAccounts.filter((account) => account.incoming !== 0);

  return {
    newAccounts,
    updatedAccounts,
    deletedAccounts,
    similarAccounts,
  };
}

export default getAccountsMapping;
