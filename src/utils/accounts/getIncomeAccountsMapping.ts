import { mapAccounts, getIncomeAccounts } from ".";

/**
 *
 * @typedef {Object} account
 * @property {number} current
 * @property {number} incoming
 * @property {string} accountId
 */
/**
 *
 * @typedef {import('./mapAccounts').accountsMapping} accountsMapping
 * @typedef {import('./getIncomeAccounts').items} items
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

import { SalesItem } from "../../types";

export default function getIncomeAccountsMapping(
  items: SalesItem[],
  incomingItems: SalesItem[]
) {
  /**
   * group both items arrays into their respective income accounts
   */
  const currentAccounts = getIncomeAccounts(items);
  const incomingAccounts = getIncomeAccounts(incomingItems);

  return mapAccounts(currentAccounts, incomingAccounts);
}
