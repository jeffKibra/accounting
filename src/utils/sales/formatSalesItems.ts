import { SalesItem } from "types";

export default function formatSaleItems(items: SalesItem[]) {
  return items.map((saleItem) => {
    const {
      itemRateTotal,
      item: {
        salesAccount: { accountId },
      },
    } = saleItem;

    return { accountId, amount: itemRateTotal };
  });
}
