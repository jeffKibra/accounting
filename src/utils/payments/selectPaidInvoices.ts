import { InvoicesPayments, IInvoice } from '../../types';

export default function selectPaidInvoices(
  payments: InvoicesPayments,
  invoices: IInvoice[]
) {
  return Object.keys(payments)
    .filter(invoiceId => payments[invoiceId] > 0)
    .map(invoiceId => {
      const invoice = invoices.find(invoice => invoice._id === invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      const { customer, ...invoiceData } = invoice;

      return invoiceData;
    });
}
