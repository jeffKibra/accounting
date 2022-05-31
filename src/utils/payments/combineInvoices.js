export default function combineInvoices(
  currentInvoices = [],
  incomingInvoices = []
) {
  const combined = [];

  currentInvoices.forEach((invoice) => {
    const { invoiceId } = invoice;
    /**
     * look for the invoice in the second array
     */
    const index = incomingInvoices.findIndex(
      (incomingInvoice) => incomingInvoice.invoiceId === invoiceId
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
    incomingInvoices.forEach((invoice) => {
      combined.push(invoice);
    });
  }

  return combined;
}
