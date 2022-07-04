/**
 *
 * @typedef {{account:{}, amount:0}[]} items
 */
/**
 *
 * @param {items} items
 * @param {""} itemsKeyToSum
 * @returns {Array.<{accountId:"", itemsTotal:0}>}
 */

import { ExpenseItem } from "../../models";

export default function getExpenseAccounts(items: ExpenseItem[]) {
  let accounts: { accountId: string; itemsTotal?: number }[] = [];

  items.forEach((item) => {
    const {
      account: { accountId },
    } = item;
    const index = accounts.findIndex(
      (account) => account.accountId === accountId
    );
    if (index === -1) {
      //not in list-add it
      accounts.push({ accountId });
    }
  });

  return accounts.map(({ accountId }) => {
    const accountItems = items.filter(
      (item) => item.account?.accountId === accountId
    );
    const itemsTotal = accountItems.reduce((sum, item) => {
      return sum + item.amount;
    }, 0);

    return {
      accountId,
      itemsTotal,
    };
  });
}
