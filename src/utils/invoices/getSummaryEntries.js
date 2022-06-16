import { getCustomerEntryData } from "../journals";

function getCustomerSummaryEntryData(
  orgId,
  customerId,
  accountId = "",
  transactionId = "",
  transactionType = "",
  shouldFetch = true
) {
  if (!shouldFetch) {
    return null;
  }

  return getCustomerEntryData(
    orgId,
    customerId,
    accountId,
    transactionId,
    transactionType
  );
}

export default async function getSummaryEntries(
  customerHasChanged,
  orgId,
  invoice,
  incomingSummary = {}
) {
  const { customerId, invoiceSlug, summary } = invoice;
  const { shipping, adjustment, totalTaxes, totalAmount } = incomingSummary;

  const [shippingEntry, adjustmentEntry, taxEntry, receivableEntry] =
    await Promise.all([
      getCustomerSummaryEntryData(
        orgId,
        customerId,
        "shipping_charge",
        invoiceSlug,
        "invoice",
        customerHasChanged || shipping !== summary.shipping
      ),
      getCustomerSummaryEntryData(
        orgId,
        customerId,
        "other_charges",
        invoiceSlug,
        "invoice",
        customerHasChanged || adjustment !== summary.adjustment
      ),
      getCustomerSummaryEntryData(
        orgId,
        customerId,
        "tax_payable",
        invoiceSlug,
        "invoice",
        customerHasChanged || totalTaxes !== summary.totalTaxes
      ),
      getCustomerSummaryEntryData(
        orgId,
        customerId,
        "accounts_receivable",
        invoiceSlug,
        "invoice",
        customerHasChanged || totalAmount !== summary.totalAmount
      ),
    ]);

  return {
    shippingEntry,
    adjustmentEntry,
    taxEntry,
    receivableEntry,
  };
}
