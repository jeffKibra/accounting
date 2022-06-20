/**
 *
 * @param {{salesAccount:{}, totalAmount:0}[]} items
 * @param {""} itemsKeyToSum
 * @returns {Array.<{accountId:"", itemsTotal:0}>}
 */

export default function getIncomeAccounts(
  items = [],
  itemsKeyToSum = "totalAmount"
) {
  let accounts = [];

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
      return sum + item[itemsKeyToSum];
    }, 0);

    return {
      accountId,
      itemsTotal,
    };
  });
}
