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

export default function getExpenseAccounts(
  items = [],
  itemsKeyToSum = "amount"
) {
  let accounts = [];

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
      return sum + item[itemsKeyToSum];
    }, 0);

    return {
      accountId,
      itemsTotal,
    };
  });
}