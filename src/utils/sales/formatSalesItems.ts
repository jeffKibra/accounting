import { ISaleItem } from 'types';

export default function formatSaleItems(items: ISaleItem[]) {
  return items.map(saleItem => {
    const {
      total,
      salesAccountId: accountId,
      // item: {
      //   salesAccount: { accountId },
      // },
    } = saleItem;

    return { accountId, amount: total };
  });
}
