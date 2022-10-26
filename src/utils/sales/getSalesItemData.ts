import BigNumber from 'bignumber.js';
import { SalesItem, Item, Tax } from 'types';

interface SelectedItemData {
  itemId: string;
  rate: number;
  quantity: number;
  salesTax?: Tax;
}
//----------------------------------------------------------------
BigNumber.config({ DECIMAL_PLACES: 2 });

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

  const { pricesIncludeTax } = itemFormData;
  console.log({ pricesIncludeTax });

  let itemRate = rate;
  let itemTax = 0;

  //set all rates to be tax exclusive
  if (salesTax?.rate) {
    if (pricesIncludeTax) {
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
    itemRate: new BigNumber(itemRate).dp(2).toNumber(),
    itemTax: new BigNumber(itemTax).dp(2).toNumber(),
    itemRateTotal: new BigNumber(itemRateTotal).dp(2).toNumber(),
    itemTaxTotal: new BigNumber(itemTaxTotal).dp(2).toNumber(),
  };

  console.log({ itemData });

  if (salesTax?.rate) {
    itemData.salesTax = salesTax;
  }
  // console.log({ itemData });

  return itemData;
}
