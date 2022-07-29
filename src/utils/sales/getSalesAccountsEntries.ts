import groupItemsBasedOnAccounts from "./groupItemsBasedOnAccounts";

import { SalesItem, SalesAccountSummary } from "../../types";

export default function getSalesAccountsEntries(selectedItems: SalesItem[]) {
  const salesAccounts = groupItemsBasedOnAccounts(selectedItems);

  const salesAccountsSummary: SalesAccountSummary[] = salesAccounts.map(
    (groupedItems) => {
      const { items, accountId } = groupedItems;
      const salesAmount: number = items.reduce<number>((sum, item) => {
        return sum + item.itemRateTotal;
      }, 0);

      return {
        accountId,
        salesAmount: salesAmount,
      };
    }
  );

  return salesAccountsSummary;
}
