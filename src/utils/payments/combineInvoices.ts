import { IInvoiceSummary, IInvoice } from '../../types';

export default function combineInvoices(
  currentInvoices: IInvoiceSummary[],
  incomingInvoices: IInvoice[]
) {
  const combined: IInvoiceSummary[] = [];

  currentInvoices.forEach(invoice => {
    const { _id: invoiceId } = invoice;
    /**
     * look for the invoice in the second array
     */
    const index = incomingInvoices.findIndex(
      incomingInvoice => incomingInvoice._id === invoiceId
    );

    if (index > -1) {
      /**
       * has been found
       * remove it from second array
       * incoming invoice has the latest data
       */
      combined.push(incomingInvoices.splice(index, 1)[0]);
    } else {
      /**
       * not found
       * use invoice from current invoices
       */
      combined.push(invoice);
    }
  });
  /**
   * check if there are any invoices left in incoming invoices
   * add them to the combined array
   */
  if (incomingInvoices.length > 0) {
    incomingInvoices.forEach(invoice => {
      combined.push(invoice);
    });
  }

  return combined;
}
