import { mapAccounts, getExpenseAccounts } from ".";
import { accountsMapping } from "./mapAccounts";
import { items } from "./getExpenseAccounts";
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
 * @param {items} items
 * @param {items} incomingItems
 * @returns {accountsMapping} accountsMapping
 */

export default function getExpenseAccountsMapping(
  items = [],
  incomingItems = []
) {
  /**
   * group both items arrays into their respective income accounts
   */
  const currentAccounts = getExpenseAccounts(items);
  const incomingAccounts = getExpenseAccounts(incomingItems);

  return mapAccounts(currentAccounts, incomingAccounts);
}
