import { getAccountTransactionEntry } from ".";

/**
 *
 * @typedef {Object} entryData
 * @property {number} current
 * @property {number} incoming
 * @property {string} accountId
 * @property {number} debit
 * @property {number} credit
 * @property {string} entryId
 */
/**
 *
 * @typedef {entryData[]} entries
 */
/**
 *
 * @param {string} orgId
 * @param {string} transactionId
 * @param {string} transactionType
 * @param {{accountId:"", current:0, incoming:0}[]} incomeAccounts
 * @returns {Promise.<entries>}
 */
export default async function getIncomeEntries(
  orgId = "",
  transactionId,
  transactionType,
  incomeAccounts = [{ incoming: 0, current: 0, accountId: "" }]
) {
  const entries = await Promise.all(
    incomeAccounts.map(async (account) => {
      const { accountId } = account;
      const entryData = await getAccountTransactionEntry(
        orgId,
        accountId,
        transactionId,
        transactionType
      );

      return {
        ...account,
        ...entryData,
      };
    })
  );

  return entries;
}
