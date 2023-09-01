import { Invoice, InvoiceSummary } from "../../types";

export default function getInvoiceFromArray(
  invoiceId: string,
  invoices: Invoice[] | InvoiceSummary[]
) {
  const invoice = invoices.find((invoice) => invoice.invoiceId === invoiceId);

  if (!invoice) throw new Error(`Invoice data with id ${invoiceId} not found!`);

  return invoice;
}
