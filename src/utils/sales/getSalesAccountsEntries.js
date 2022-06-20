import groupItemsBasedOnAccounts from "./groupItemsBasedOnAccounts";
/**
 *
 * @typedef {Object} item
 * @property {string} salesAccountId
 * @property {number} totalAmount
 * @property {number} taxExclusiveAmount
 */
/**
 *
 * @param {item[]} selectedItems
 * @param {string} salesAmountKey
 * @returns {{accountId:string, salesAmount:number}[]} salesAccounts
 */

export default function getSalesAccountsEntries(
  selectedItems = [],
  salesAmountKey = "taxExclusiveAmount"
) {
  let salesAccounts = groupItemsBasedOnAccounts(selectedItems);

  salesAccounts = salesAccounts.map(async (account) => {
    const { items, accountId } = account;
    const salesAmount = items.reduce((sum, item) => {
      return sum + item[salesAmountKey];
    }, 0);

    return {
      accountId,
      salesAmount,
    };
  });

  return salesAccounts;
}
