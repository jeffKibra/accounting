import { SalesItem } from "types";

export default function formatSaleItems(items: SalesItem[]) {
  return items.map((item) => {
    const {
      itemRateTotal,
      salesAccount: { accountId },
    } = item;

    return { accountId, amount: itemRateTotal };
  });
}
