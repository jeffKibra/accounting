import { mapAccounts, getExpenseAccounts } from ".";

/**
 *
 * @typedef {Object} account
 * @property {number} current
 * @property {number} incoming
 * @property {string} accountId
 */
/**
 *
 * @typedef {Array.<account>} accountsData
 */
/**
 *
 * @typedef {import('./mapAccounts').accountsMapping} accountsMapping
 * @typedef {import('./getExpenseAccounts').items} items
 */
/**
 *
 * @param {items} items
 * @param {items} incomingItems
 * @returns {accountsMapping} accountsMapping
 */

import { ExpenseItem } from "../../types";

export default function getExpenseAccountsMapping(
  items: ExpenseItem[],
  incomingItems: ExpenseItem[]
) {
  /**
   * group both items arrays into their respective income accounts
   */
  const currentAccounts = getExpenseAccounts(items);
  const incomingAccounts = getExpenseAccounts(incomingItems);

  return mapAccounts(currentAccounts, incomingAccounts);
}
