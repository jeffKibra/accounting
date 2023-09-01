import { SaleItem } from 'types';

export default function getItemsAccounts(items: SaleItem[]) {
  return items.map(saleItem => {
    const {
      itemRateTotal,
      item: {
        salesAccount: { accountId },
      },
    } = saleItem;

    return { accountId, amount: itemRateTotal };
  });
}
