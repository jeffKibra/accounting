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

import { AccountType } from "../../types";

export default function createDebit(accountType: AccountType, amount: number) {
  const { main } = accountType;

  if (amount <= 0) {
    throw new Error("Value should be greater than zero(0)");
  }

  let credit = 0;

  if (isDebitOnIncrease(main)) {
    /**
     * value should be negative to credit it
     */
    credit = 0 - amount;
  } else if (isCreditOnIncrease(main)) {
    /**
     *value should be positive to credit it
     */
    credit = amount;
  }

  return credit;
}
