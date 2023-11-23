import { ISaleItem } from 'types';

function formatToCurrency(value: number) {
  return Number(value).toLocaleString();
}

export default function generatePDFSaleItemsTable(
  items: ISaleItem[],
  taxType: 'exclusive' | 'inclusive'
) {
  return {
    margin: [0, 16],
    layout: 'lightHorizontalLines',
    table: {
      headerRows: 1,
      widths: ['auto', '*', 'auto', 'auto', 'auto'],
      body: [
        [
          { text: '#', fillColor: '#e2e8f0', margin: [4, 4] },
          {
            text: 'Item',
            fillColor: '#e2e8f0',
            margin: [4, 4],
          },
          {
            text: 'Qty',
            fillColor: '#e2e8f0',
            margin: [4, 4],
            alignment: 'right',
          },
          {
            text: 'Rate',
            fillColor: '#e2e8f0',
            alignment: 'right',
            margin: [4, 4],
          },
          {
            text: 'Amount',
            fillColor: '#e2e8f0',
            alignment: 'right',
            margin: [4, 4],
          },
        ],
        ...items.map((item, i) => {
          const {
            name,
            qty,
            rate: itemRate,
            tax: itemTax,
            subTotal,
            // taxTotal,
            total: itemTotal,
          } = item;

          const itemNo = i + 1;
          const rate = taxType === 'inclusive' ? itemRate + itemTax : itemRate;
          const total = taxType === 'inclusive' ? itemTotal : subTotal;

          return [
            { text: itemNo, margin: [4, 4] },
            { text: name, margin: [4, 4] },
            {
              text: formatToCurrency(qty),
              margin: [4, 4],
              alignment: 'right',
            },
            {
              text: formatToCurrency(rate),
              margin: [4, 4],
              alignment: 'right',
            },
            {
              text: formatToCurrency(total),
              alignment: 'right',
              margin: [4, 4],
            },
          ];
        }),
      ],
    },
  };
}
