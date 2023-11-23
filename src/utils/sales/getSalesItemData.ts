import BigNumber from 'bignumber.js';
import {
  ISaleItem,
  IVehicle,
  ITaxSummary,
  // ISaleItemFormData
} from 'types';

//----------------------------------------------------------------
BigNumber.config({ DECIMAL_PLACES: 2 });

interface IUserSelectedSaleItem {
  itemId: string;
  quantity: number;
  rate: number;
  salesTax: ITaxSummary;
  item: IVehicle;
}

export default function getSalesItemData(formData: IUserSelectedSaleItem) {
  console.log({ formData });

  const { rate, quantity, salesTax, item, itemId, ...saleItemMoreData } =
    formData;
  const { registration: name } = item;
  const taxType = 'inclusive';

  let itemRate = rate; //init with rate assuming rate is tax-exclusive.
  let itemTax = 0;

  //set all rates to be tax exclusive
  if (salesTax?.rate) {
    if (taxType === 'inclusive') {
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
  const subTotal = new BigNumber(itemRate).times(quantity);
  const taxTotal = new BigNumber(itemTax).times(quantity);
  const total = subTotal.plus(taxTotal);

  const itemData: ISaleItem = {
    ...saleItemMoreData,
    name,
    itemId,
    details: { ...item, taxType },
    rate,
    tax: new BigNumber(itemTax).dp(2).toNumber(),
    qty: quantity,
    // itemRate: new BigNumber(itemRate).dp(2).toNumber(),
    subTotal: subTotal.dp(2).toNumber(),
    taxTotal: taxTotal.dp(2).toNumber(),
    total: total.dp(2).toNumber(),
    salesAccountId: '',
    description: '',
    // salesTax: salesTax?.rate ? salesTax : null,
  };

  console.log({ itemData });

  // console.log({ itemData });

  return itemData;
}
