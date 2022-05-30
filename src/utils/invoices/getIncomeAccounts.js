/**
 *
 * @param {[{}]} items
 * @param {""} itemsKeyToSum
 * @returns {[{accountId:"", itemsTotal:0}]}
 */

export default function getIncomeAccounts(
  items = [],
  itemsKeyToSum = "taxExclusiveAmount"
) {
  let accounts = [];

  items.forEach((item) => {
    const { salesAccountId } = item;
    const index = accounts.findIndex(
      (account) => account.accountId === salesAccountId
    );
    if (index === -1) {
      //not in list-add it
      accounts.push({ accountId: salesAccountId });
    }
  });

  return accounts.map(({ accountId }) => {
    const accountItems = items.filter(
      (item) => item.salesAccountId === accountId
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
