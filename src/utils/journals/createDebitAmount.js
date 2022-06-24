import { isCreditOnIncrease, isDebitOnIncrease } from "./types";
/**
 * @typedef {Object} accountType
 * @property {string} id
 * @property {string} main
 * @property {string} name
 */
/**
 *
 * @param {accountType} accountType
 * @param {number} amount
 * @returns {number} debitAmount
 */
export default function createDebit(
  accountType = { id: "", main: "", name: "" },
  amount = 0
) {
  const { main } = accountType;

  if (amount <= 0) {
    throw new Error("Value should be greater than zero(0)");
  }

  let debit = 0;

  if (isDebitOnIncrease(main)) {
    /**
     * value should be positive to debit it
     */
    debit = amount;
  } else if (isCreditOnIncrease(main)) {
    /**
     *value should be negative to debit it
     */
    debit = 0 - amount;
  }

  return debit;
}
