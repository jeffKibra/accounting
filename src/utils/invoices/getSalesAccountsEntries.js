import groupItemsBasedOnAccounts from "./groupItemsBasedOnAccounts";

export default function getSalesAccountsEntries(
  selectedItems = [],
  salesAmountKey = "taxExclusiveAmount"
) {
  let salesAccounts = groupItemsBasedOnAccounts(selectedItems);

  salesAccounts = salesAccounts.map(async (account) => {
    const { items } = account;
    const salesAmount = items.reduce((sum, item) => {
      return sum + item[salesAmountKey];
    }, 0);

    return {
      ...account,
      salesAmount,
    };
  });

  return salesAccounts;
}
