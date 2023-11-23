import { ISaleItem } from 'types';

export default function getItemsAccounts(items: ISaleItem[]) {
  return items.map(saleItem => {
    const {
      // itemRateTotal,
      // item: {
      //   salesAccount: { accountId },
      // },
      total,
      salesAccountId: accountId,
    } = saleItem;

    return { accountId, amount: total };
  });
}
