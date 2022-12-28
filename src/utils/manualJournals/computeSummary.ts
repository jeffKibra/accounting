import { IManualJournalEntry, TaxSummary } from 'types';
import BigNumber from 'bignumber.js';

interface SummaryEntry {
  credit: number;
  debit: number;
}

interface TaxEntry extends TaxSummary, SummaryEntry {}

interface Taxes {
  [key: string]: TaxEntry;
}

interface SubSummary {
  subTotal: SummaryEntry;
  totalTax: SummaryEntry;
  taxes: Taxes;
}

interface Summary extends Omit<SubSummary, 'taxes'> {
  total: SummaryEntry;
  taxes: TaxEntry[];
}

BigNumber.config({ DECIMAL_PLACES: 2 });

export default function computeSummary(entries: IManualJournalEntry[]) {
  // console.log({ entries });

  const computedSubSummary = entries.reduce(
    (summary: SubSummary, entry) => {
      const { taxes } = summary;

      const { tax, type } = entry;
      const entryIsDebit = type === 'debit';

      const entryCredit = new BigNumber(entryIsDebit ? 0 : entry?.amount);
      const entryDebit = new BigNumber(entryIsDebit ? entry?.amount : 0);

      const newSummary = {
        ...summary,
      };
      let newTaxes = { ...taxes };

      if (tax) {
        /**
         * step 1
         * accumulate tax total of all tax types
         */
        //entry has a tax field
        const taxId = tax.taxId;
        const taxRate = new BigNumber(tax.rate).dividedBy(100);

        const taxDebit = entryDebit.times(taxRate).dp(2).toNumber();
        const taxCredit = entryCredit.times(taxRate).dp(2).toNumber();
        // console.log({ taxCredit, taxDebit });

        //check if a similar tax is available in the taxes summary
        const currentTax = taxes[taxId];

        if (currentTax) {
          const currentTaxCredit = new BigNumber(currentTax.credit || 0);
          const currentTaxDebit = new BigNumber(currentTax.debit || 0);
          //if tax is available in the tax summary, increment its totalTax value
          newTaxes[taxId] = {
            ...currentTax,
            credit: currentTaxCredit.plus(taxCredit).dp(2).toNumber(),
            debit: currentTaxDebit.plus(taxDebit).dp(2).toNumber(),
          };
        } else {
          //create new tax field
          newTaxes[taxId] = {
            ...tax,
            credit: taxCredit,
            debit: taxDebit,
          };
        }
        //asign taxes field
        newSummary.taxes = newTaxes;

        /**
         * step 2:
         * accumulate the overall tax total for the sale
         */
        const currentTotalTaxCredit = new BigNumber(summary.totalTax.credit);
        const currentTotalTaxDebit = new BigNumber(summary.totalTax.debit);

        const newTotalTaxCredit = currentTotalTaxCredit
          .plus(taxCredit)
          .dp(2)
          .toNumber();
        const newTotalTaxDebit = currentTotalTaxDebit
          .plus(taxDebit)
          .dp(2)
          .toNumber();

        newSummary.totalTax = {
          credit: newTotalTaxCredit,
          debit: newTotalTaxDebit,
        };
      }

      /**
       * calculate subtotal values
       */
      const currentSubTotalCredit = new BigNumber(summary.subTotal.credit);
      const currentSubTotalDebit = new BigNumber(summary.subTotal.debit);

      const newSubTotalCredit = currentSubTotalCredit
        .plus(entryCredit)
        .dp(2)
        .toNumber();
      const newSubTotalDebit = currentSubTotalDebit
        .plus(entryDebit)
        .dp(2)
        .toNumber();

      newSummary.subTotal = {
        credit: newSubTotalCredit,
        debit: newSubTotalDebit,
      };

      return newSummary;
    },
    {
      subTotal: { credit: 0, debit: 0 },
      totalTax: { debit: 0, credit: 0 },
      taxes: {},
    }
  );

  const { taxes, subTotal, totalTax } = computedSubSummary;
  /**
   * calaculate total values
   */
  const subTotalCredit = new BigNumber(subTotal.credit);
  const subTotalDebit = new BigNumber(subTotal.debit);

  const totalCredit = subTotalCredit.plus(totalTax.credit).dp(2).toNumber();
  const totalDebit = subTotalDebit.plus(totalTax.debit).dp(2).toNumber();

  const computedSummary: Summary = {
    ...computedSubSummary,
    taxes: Object.values(taxes),
    total: { credit: totalCredit, debit: totalDebit },
  };

  return computedSummary;
}
