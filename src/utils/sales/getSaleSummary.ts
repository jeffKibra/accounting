import { SalesItem, SalesTax } from "types";

interface Taxes {
  [key: string]: SalesTax;
}

interface Summary {
  subTotal: number;
  totalTax: number;
  taxes: Taxes;
}

export default function getSaleSummary(selectedItems: SalesItem[]) {
  const { subTotal, totalTax, taxes } = selectedItems.reduce(
    (summary: Summary, item) => {
      const { subTotal, taxes } = summary;
      const { itemRateTotal, itemTaxTotal, salesTax } = item;

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

        if (currentTax) {
          //if tax is available in the tax summary, increment its totalTaxes value
          newTaxes[taxId] = {
            ...currentTax,
            totalTax: currentTax.totalTax + itemTaxTotal,
          };
        } else {
          //create new tax field
          newTaxes[taxId] = {
            ...salesTax,
            totalTax: itemTaxTotal,
          };
        }
        //asign taxes field
        newSummary.taxes = newTaxes;

        /**
         * step 2:
         * accumulate the overall tax total for the sale
         */
        newSummary.totalTax = newSummary.totalTax + itemTaxTotal;
      }

      return {
        ...newSummary,
        subTotal: subTotal + itemRateTotal,
      };
    },
    { subTotal: 0, totalTax: 0, taxes: {} }
  );

  return {
    taxes: Object.values(taxes),
    subTotal: +subTotal.toFixed(2),
    totalTax: +totalTax.toFixed(2),
  };
}
