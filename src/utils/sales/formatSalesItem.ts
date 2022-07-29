import { Account, Tax, SalesItem } from "types";

interface SelectedItemData {
  itemId: string;
  name: string;
  salesAccount: Account;
  salesTax: Tax | null;
  salesTaxType: string;
  rate: number;
  quantity: number;
}

export default function formatSalesItem(salesItem: SelectedItemData) {
  // console.log({ data });
  const { rate, quantity, salesTax, salesTaxType } = salesItem;
  let itemRate = rate;
  let itemTax = 0;

  //set all rates to be tax exclusive
  if (salesTax?.rate) {
    if (salesTaxType === "tax inclusive") {
      //item rate is inclusive of tax
      const tax = (salesTax.rate / (100 + salesTax.rate)) * rate;
      itemRate = rate - tax;
    }
    //compute final tax after discounts
    itemTax = (salesTax.rate / 100) * itemRate;
  }

  /**
   * finally compute amounts based on item quantity
   */
  const itemRateTotal = itemRate * quantity;
  const itemTaxTotal = itemTax * quantity;

  const itemData: SalesItem = {
    ...salesItem,
    itemRate: +itemRate.toFixed(2),
    itemTax: +itemTax.toFixed(2),
    itemRateTotal: +itemRateTotal.toFixed(2),
    itemTaxTotal: +itemTaxTotal.toFixed(2),
  };
  // console.log({ itemData });

  return itemData;
}
