/**
 *
 * @typedef {Object} pureEntry
 * @property {number} debit
 * @property {number} credit
 * @property {string} entryId
 */
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
 * @typedef {import('../accounts').account} account
 */
/**
 *
 * @typedef {Object} entryWithAccount
 * @property {number} credit
 * @property {number} debit
 * @property {string} entryId
 * @property {account} account
 */
/**
 *
 * @typedef {Object} entriesWithAccount
 * @property {entryWithAccount[]} entries
 */
/**
 *
 * @typedef {account & entriesWithAccount} entriesGroup
 */

export { getCustomerEntryData } from "./entries";
export { default as changeEntriesAccount } from "./changeEntriesAccount";
export { default as createEntry } from "./createEntry";
export { default as createSimilarAccountEntries } from "./createSimilarAccountEntries";
export { default as updateEntry } from "./updateEntry";
export { default as updateSimilarAccountEntries } from "./updateSimilarAccountEntries";
export { default as deleteEntry } from "./deleteEntry";
export { default as deleteSimilarAccountEntries } from "./deleteSimilarAccountEntries";
export { default as groupEntriesIntoAccounts } from "./groupEntriesIntoAccounts";
export { default as getAmountState } from "./getAmountState";
export { default as createDebitAndCredit } from "./createDebitAndCredit";
export { default as getTransactionEntries } from "./getTransactionEntries";
export { default as getAccountTransactionEntry } from "./getAccountTransactionEntry";
export { default as getIncomeEntries } from "./getIncomeEntries";
export { default as createCreditAmount } from "./createCreditAmount";
export { default as createDebitAmount } from "./createDebitAmount";
