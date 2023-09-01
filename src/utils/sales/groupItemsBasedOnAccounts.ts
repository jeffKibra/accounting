import { SalesItem, GroupedItems } from "../../types";

interface SalesAccountsWithItems {
  [key: string]: SalesItem[];
}

export default function groupItemsBasedOnAccounts(itemsList: SalesItem[]) {
  let salesAccounts: GroupedItems[];

  const salesAccountsWithItems: SalesAccountsWithItems = itemsList.reduce(
    (summary: SalesAccountsWithItems, item) => {
      const {
        item: {
          salesAccount: { accountId },
        },
      } = item;

      const updatedItems = summary[accountId]
        ? [...summary[accountId], item]
        : [item];

      return {
        ...summary,
        [accountId]: updatedItems,
      };
    },
    {}
  );

  salesAccounts = Object.keys(salesAccountsWithItems).map((accountId) => {
    return {
      accountId,
      items: salesAccountsWithItems[accountId],
    };
  });

  return salesAccounts;
}
