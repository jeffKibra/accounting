import { mapAccounts, getIncomeAccounts } from ".";
import { accountsMapping } from "./mapAccounts";
import { items } from "./getIncomeAccounts";
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
 * @returns {accountsMapping}
 */
export default function getIncomeAccountsMapping(
  items = [],
  incomingItems = []
) {
  /**
   * group both items arrays into their respective income accounts
   */
  const currentAccounts = getIncomeAccounts(items);
  const incomingAccounts = getIncomeAccounts(incomingItems);

  return mapAccounts(currentAccounts, incomingAccounts);
}
