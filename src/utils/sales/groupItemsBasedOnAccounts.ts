import { ISaleItem, 
  // GroupedItems 
} from '../../types';

interface SalesAccountsWithItems {
  [key: string]: ISaleItem[];
}

export default function groupItemsBasedOnAccounts(itemsList: ISaleItem[]) {
  // let salesAccounts: GroupedItems[];
  // const salesAccountsWithItems: SalesAccountsWithItems = itemsList.reduce(
  //   (summary: SalesAccountsWithItems, item) => {
  //     const {
  //       item: {
  //         salesAccount: { accountId },
  //       },
  //     } = item;
  //     const updatedItems = summary[accountId]
  //       ? [...summary[accountId], item]
  //       : [item];
  //     return {
  //       ...summary,
  //       [accountId]: updatedItems,
  //     };
  //   },
  //   {}
  // );
  // salesAccounts = Object.keys(salesAccountsWithItems).map(accountId => {
  //   return {
  //     accountId,
  //     items: salesAccountsWithItems[accountId],
  //   };
  // });
  // return salesAccounts;
}
