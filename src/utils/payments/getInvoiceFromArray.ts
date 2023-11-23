import { IInvoice, IInvoiceSummary } from '../../types';

export default function getInvoiceFromArray(
  invoiceId: string,
  invoices: IInvoice[] | IInvoiceSummary[]
) {
  const invoice = invoices.find(invoice => invoice._id === invoiceId);

  if (!invoice) throw new Error(`Invoice data with id ${invoiceId} not found!`);

  return invoice;
}
