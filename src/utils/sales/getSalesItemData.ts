import BigNumber from 'bignumber.js';
import { SalesItem, ISaleItemFormData } from 'types';

//----------------------------------------------------------------
BigNumber.config({ DECIMAL_PLACES: 2 });

export default function getSalesItemData(formData: ISaleItemFormData) {
  console.log({ formData });
  const { rate, quantity, salesTax, item, ...saleItemMoreData } = formData;
  const {
    createdAt,
    createdBy,
    modifiedAt,
    modifiedBy,
    status,
    ...ItemFormData
  } = item;

  const { pricesIncludeTax } = ItemFormData;
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
    ...saleItemMoreData,
    item: { ...ItemFormData },
    rate,
    quantity,
    itemRate: new BigNumber(itemRate).dp(2).toNumber(),
    itemTax: new BigNumber(itemTax).dp(2).toNumber(),
    itemRateTotal: new BigNumber(itemRateTotal).dp(2).toNumber(),
    itemTaxTotal: new BigNumber(itemTaxTotal).dp(2).toNumber(),
    salesTax: salesTax?.rate ? salesTax : null,
  };

  console.log({ itemData });

  // console.log({ itemData });

  return itemData;
}
