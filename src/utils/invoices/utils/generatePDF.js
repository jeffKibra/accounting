import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { generatePDFSaleItemsTable } from 'utils/sales';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function formatToCurrency(value) {
  return Number(value).toLocaleString();
}

export default async function generatePDF(invoice, currency = 'KES') {
  const {
    invoiceId,
    summary,
    customer,
    selectedItems,
    invoiceDate,
    dueDate,
    balance,
  } = invoice;
  const customerDisplayName = customer?.displayName || '';
  //
  const subTotal = summary?.subTotal || 0;
  const shipping = summary?.shipping || 0;
  const adjustment = summary?.adjustment || 0;
  const taxType = summary?.taxType || 'taxExclusive';
  const totalAmount = summary?.totalAmount || 0;
  const taxes = summary?.taxes || [];

  const docDefinition = {
    // userPassword: employeeICNumber,
    // ownerPassword: 'superadmin@ROLLING_PAY',
    permissions: {
      printing: 'highResolution', //'lowResolution'
      modifying: false,
      copying: true,
      annotating: true,
      fillingForms: true,
      contentAccessibility: true,
      documentAssembly: true,
    },
    content: [
      //   {
      //     image,
      //     width: 120,
      //     alignment: 'center',
      //     margin: [0, 24, 0, 0],
      //   },
      {
        text: 'INVOICE',
        alignment: 'right',
        fontSize: 24,
        margin: [0, 0],
        bold: true,
      },
      {
        text: `#${invoiceId}`,
        alignment: 'right',
        fontSize: 14,
        margin: [0, 16],
        bold: true,
      },
      {
        text: 'Balance Due',
        alignment: 'right',
        // fontSize: 14,
        margin: [0, 0],
      },
      {
        text: `${currency} ${balance || 0}`,
        alignment: 'right',
        fontSize: 14,
        margin: [0, 4, 0, 16],
        bold: true,
      },
      {
        columns: [
          [
            {
              text: 'Bill To',
              // alignment: 'left',
              // fontSize: 14,
              margin: [0, 8],
            },
            {
              text: `${customerDisplayName} `,
              // alignment: 'left',
              // fontSize: 14,
              margin: [0, 0],
              bold: true,
            },
          ],
          {
            layout: 'noBorders',
            table: {
              headerRows: 0,
              widths: ['*', '*'],
              // fontSize: 14,
              body: [
                [
                  {
                    text: 'Invoice Date:',
                    alignment: 'right',
                    margin: [4, 4, 4, 0],
                  },
                  {
                    text: new Date(invoiceDate).toDateString(),
                    alignment: 'right',
                    margin: [4, 4, 4, 0],
                  },
                ],
                [
                  {
                    text: 'Due Date:',
                    alignment: 'right',
                    margin: [4, 4],
                  },
                  {
                    text: new Date(dueDate).toDateString(),
                    alignment: 'right',
                    margin: [4, 4],
                  },
                ],
              ],
            },
          },
        ],
      },
      //items table
      generatePDFSaleItemsTable(selectedItems, taxType),
      //summary table
      {
        columns: [
          {},
          {
            layout: 'noBorders',
            table: {
              headerRows: 0,
              widths: ['*', 'auto'],
              fontSize: 14,
              body: [
                [
                  {
                    text: 'Sub Total',
                    alignment: 'right',
                    margin: [16, 4, 4, 4],
                  },
                  {
                    text: formatToCurrency(subTotal),
                    alignment: 'right',
                    margin: [16, 4, 4, 4],
                  },
                ],
                shipping
                  ? [
                      {
                        text: 'Shipping Charges:',
                        alignment: 'right',
                        margin: [16, 4, 4, 4],
                      },
                      {
                        text: formatToCurrency(shipping),
                        alignment: 'right',
                        margin: [16, 4, 4, 4],
                      },
                    ]
                  : [],

                ...taxes.map(tax => {
                  const { name, rate, totalTax } = tax;
                  return [
                    {
                      text: `${name} (${rate}):`,
                      alignment: 'right',
                      margin: [16, 4, 4, 4],
                    },
                    {
                      text: formatToCurrency(totalTax || 0),
                      alignment: 'right',
                      margin: [16, 4, 4, 4],
                    },
                  ];
                }),
                adjustment
                  ? [
                      {
                        text: 'Adjustment:',
                        alignment: 'right',
                        margin: [16, 4, 4, 4],
                      },
                      {
                        text: formatToCurrency(adjustment),
                        alignment: 'right',
                        margin: [16, 4, 4, 4],
                      },
                    ]
                  : [],
                [
                  {
                    text: 'Total:',
                    alignment: 'right',
                    margin: [16, 4, 4, 4],
                    bold: true,
                  },
                  {
                    text: formatToCurrency(totalAmount),
                    alignment: 'right',
                    margin: [16, 4, 4, 4],
                    bold: true,
                  },
                ],
                [
                  {
                    text: 'Balance Due:',
                    alignment: 'right',
                    margin: [16, 4, 4, 4],
                    // fillColor: '#e2e8f0',
                    bold: true,
                  },
                  {
                    text: formatToCurrency(balance),
                    alignment: 'right',
                    margin: [16, 4, 4, 4],
                    bold: true,
                    // fillColor: '#e2e8f0',
                  },
                ],
              ],
            },
          },
        ],
      },
    ],

    styles: {
      details: {
        alignment: 'right',
      },
    },
    defaultStyle: {
      // font: 'Roboto',
      fontSize: 12,
    },
  };

  pdfMake.createPdf(docDefinition).download();
}
