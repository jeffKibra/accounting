import { SalesItem, Item, Tax } from 'types';

interface SelectedItemData {
  itemId: string;
  rate: number;
  quantity: number;
  salesTax?: Tax;
}

export default function getSalesItemData(
  salesItem: SelectedItemData,
  item: Item
) {
  // console.log({ data });
  const { rate, quantity, salesTax } = salesItem;
  const {
    createdAt,
    createdBy,
    modifiedAt,
    modifiedBy,
    status,
    ...itemFormData
  } = item;

  const { salesTaxType } = itemFormData;

  let itemRate = rate;
  let itemTax = 0;

  //set all rates to be tax exclusive
  if (salesTax?.rate) {
    if (salesTaxType === 'tax inclusive') {
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
    item: { ...itemFormData },
    rate,
    quantity,
    itemRate: +itemRate.toFixed(2),
    itemTax: +itemTax.toFixed(2),
    itemRateTotal: +itemRateTotal.toFixed(2),
    itemTaxTotal: +itemTaxTotal.toFixed(2),
  };

  if (salesTax?.rate) {
    itemData.salesTax = salesTax;
  }
  // console.log({ itemData });

  return itemData;
}
