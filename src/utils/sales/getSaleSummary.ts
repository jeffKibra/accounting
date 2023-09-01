import { SalesItem, SalesTax } from 'types';
import BigNumber from 'bignumber.js';

interface Taxes {
  [key: string]: SalesTax;
}

interface Summary {
  subTotal: number;
  totalTax: number;
  taxes: Taxes;
}

BigNumber.config({ DECIMAL_PLACES: 2 });

export default function getSaleSummary(selectedItems: SalesItem[]) {
  console.log({ selectedItems });

  const { subTotal, totalTax, taxes } = selectedItems.reduce(
    (summary: Summary, item) => {
      const { taxes } = summary;
      const subTotal = new BigNumber(summary.subTotal);

      const { salesTax } = item;
      const itemTaxTotal = new BigNumber(item.itemTaxTotal);
      const itemRateTotal = new BigNumber(item.itemRateTotal);

      const newSummary = {
        ...summary,
      };
      let newTaxes = { ...taxes };

      if (salesTax) {
        /**
         * step 1
         * accumulate tax total of all tax types
         */
        //item has a tax field
        const taxId = salesTax.taxId;
        //check if a similar tax is available in the taxes summary
        const currentTax = taxes[taxId];

        const currentTotalTax = new BigNumber(currentTax?.totalTax || 0);

        if (currentTax) {
          //if tax is available in the tax summary, increment its totalTax value
          newTaxes[taxId] = {
            ...currentTax,
            totalTax: currentTotalTax.plus(itemTaxTotal).dp(2).toNumber(),
          };
        } else {
          //create new tax field
          newTaxes[taxId] = {
            ...salesTax,
            totalTax: itemTaxTotal.dp(2).toNumber(),
          };
        }
        //asign taxes field
        newSummary.taxes = newTaxes;

        /**
         * step 2:
         * accumulate the overall tax total for the sale
         */
        const prevTotalTax = new BigNumber(newSummary.totalTax);
        newSummary.totalTax = prevTotalTax.plus(itemTaxTotal).dp(2).toNumber();
      }

      return {
        ...newSummary,
        subTotal: subTotal.plus(itemRateTotal).dp(2).toNumber(),
      };
    },
    { subTotal: 0, totalTax: 0, taxes: {} }
  );

  return {
    taxes: Object.values(taxes),
    subTotal,
    totalTax,
  };
}
