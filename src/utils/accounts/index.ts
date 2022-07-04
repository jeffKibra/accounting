/**
 *
 * @typedef {Object} accountType
 * @property {string} main
 * @property {string} id
 * @property {string} name
 */
/**
 *
 * @typedef {Object} account
 * @property {string} name
 * @property {string} accountId
 * @property {accountType} accountType
 */

/**
 *
 * @typedef {Object} accountMapping
 * @property {number} current
 * @property {number} incoming
 * @property {string} accountId
 */
/**
 *
 * @typedef {Object} accountsMapping
 * @property {accountMapping[]} uniqueAccounts
 * @property {accountMapping[]} similarAccounts
 * @property {accountMapping[]} updatedAccounts
 * @property {accountMapping[]} deletedAccounts
 * @property {accountMapping[]} newAccounts
 */

export { default as getAccountsMapping } from "./getAccountsMapping";
export { default as getAccountData } from "./getAccountData";
export { default as getIncomeAccounts } from "./getIncomeAccounts";
export { default as getIncomeAccountsMapping } from "./getIncomeAccountsMapping";
export { default as mapAccounts } from "./mapAccounts";
export { default as getExpenseAccounts } from "./getExpenseAccounts";
export { default as getExpenseAccountsMapping } from "./getExpenseAccountsMapping";
