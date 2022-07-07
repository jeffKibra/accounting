/**
 *
 * @typedef {{salesAccount:{}, totalAmount:0}[]} items
 */
/**
 *
 * @param {items} items
 * @param {""} itemsKeyToSum
 * @returns {Array.<{accountId:"", itemsTotal:0}>}
 */

import { SalesItem } from "../../types";

export default function getIncomeAccounts(items: SalesItem[]) {
  let accounts: { accountId: string; itemsTotal?: number }[] = [];

  items.forEach((item) => {
    const {
      salesAccount: { accountId },
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
      (item) => item.salesAccount?.accountId === accountId
    );
    const itemsTotal = accountItems.reduce((sum, item) => {
      return sum + item.totalAmount;
    }, 0);

    return {
      accountId,
      itemsTotal,
    };
  });
}
