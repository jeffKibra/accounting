import { PaymentsToInvoices, Invoice } from "../../types";

export default function selectPaidInvoices(
  payments: PaymentsToInvoices,
  invoices: Invoice[]
) {
  return Object.keys(payments)
    .filter((invoiceId) => payments[invoiceId] > 0)
    .map((invoiceId) => {
      const invoice = invoices.find(
        (invoice) => invoice.invoiceId === invoiceId
      );
      if (!invoice) {
        throw new Error("Invoice not found");
      }

      const { customer, org, ...invoiceData } = invoice;

      return invoiceData;
    });
}
