/**
 *
 * @param {[{}]} itemsList
 * @returns {{accountId:'', items:[{}]}}
 */
export default function groupItemsBasedOnAccounts(itemsList = []) {
  let salesAccounts = [];

  itemsList.forEach((item) => {
    const { salesAccountId } = item;
    const index = salesAccounts.findIndex(
      (account) => account.accountId === salesAccountId
    );
    if (index === -1) {
      //not in list-add it
      salesAccounts.push({ accountId: salesAccountId });
    }
  });

  return salesAccounts.map(({ accountId }) => {
    const items = itemsList.filter((item) => item.salesAccountId === accountId);

    return {
      accountId,
      items,
    };
  });
}
