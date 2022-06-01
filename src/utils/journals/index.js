import {
  newDebitOnIncrease,
  updateDebitOnIncrease,
  deleteDebitOnIncrease,
} from "./debitOnIncrease";
import {
  newCreditOnIncrease,
  updateCreditOnIncrease,
  deleteCreditOnIncrease,
} from "./creditOnIncrease";

export { getCustomerEntryData } from "./entries";

//debit on increase and credit on decrease
export const assetEntry = {
  newEntry: newDebitOnIncrease,
  updateEntry: updateDebitOnIncrease,
  deleteEntry: deleteDebitOnIncrease,
};

export const expenseEntry = {
  newEntry: newDebitOnIncrease,
  updateEntry: updateDebitOnIncrease,
  deleteEntry: deleteDebitOnIncrease,
};

//credit on increase and debit on decrease
export const liabilityEntry = {
  newEntry: newCreditOnIncrease,
  updateEntry: updateCreditOnIncrease,
  deleteEntry: deleteCreditOnIncrease,
};

export const equityEntry = {
  newEntry: newCreditOnIncrease,
  updateEntry: updateCreditOnIncrease,
  deleteEntry: deleteCreditOnIncrease,
};

export const incomeEntry = {
  newEntry: newCreditOnIncrease,
  updateEntry: updateCreditOnIncrease,
  deleteEntry: deleteCreditOnIncrease,
};

export { default as changeEntriesAccount } from "./changeEntriesAccount";
export { default as createEntry } from "./createEntry";
export { default as createSimilarAccountEntries } from "./createSimilarAccountEntries";
export { default as updateEntry } from "./updateEntry";
export { default as updateSimilarAccountEntries } from "./updateSimilarAccountEntries";
export { default as deleteEntry } from "./deleteEntry";
export { default as deleteSimilarAccountEntries } from "./deleteSimilarAccountEntries";
export { default as groupEntriesIntoAccounts } from "./groupEntriesIntoAccounts";
