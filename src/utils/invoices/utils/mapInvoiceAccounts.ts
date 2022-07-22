import { getAccountsMapping } from "../../accounts";

import { formatSalesItems } from "../../sales";
import { Invoice, InvoiceFormData } from "types";

export default function mapInvoiceAccounts(
  currentInvoice: Invoice | InvoiceFormData,
  incomingInvoice: Invoice | InvoiceFormData
) {
  const {
    summary,
    selectedItems,
    customer: { customerId },
  } = incomingInvoice;
  const { totalTaxes, shipping, adjustment, totalAmount } = summary;

  const {
    customer: { customerId: currentCustomerId },
    summary: currentSummary,
  } = currentInvoice;
  /**
   * check if customer has been changed
   */
  const customerHasChanged = currentCustomerId !== customerId;

  const currentItems = [
    ...formatSalesItems(currentInvoice.selectedItems),
    {
      accountId: "shipping_charge",
      amount: currentSummary.shipping,
    },
    {
      accountId: "other_charges",
      amount: currentSummary.adjustment,
    },
    {
      accountId: "tax_payable",
      amount: currentSummary.totalTaxes,
    },
    {
      accountId: "accounts_receivable",
      amount: currentSummary.totalAmount,
    },
  ];

  const incomingItems = [
    ...formatSalesItems(selectedItems),
    {
      accountId: "shipping_charge",
      amount: shipping,
    },
    {
      accountId: "other_charges",
      amount: adjustment,
    },
    {
      accountId: "tax_payable",
      amount: totalTaxes,
    },
    {
      accountId: "accounts_receivable",
      amount: totalAmount,
    },
  ];

  let { deletedAccounts, newAccounts, updatedAccounts, similarAccounts } =
    getAccountsMapping(currentItems, incomingItems);

  /**
   * update accounts to update if also customer has changed
   */
  updatedAccounts = customerHasChanged
    ? [...updatedAccounts, ...similarAccounts]
    : updatedAccounts;
  /**
   * get entries data for deletedAccounts and accountsToUpdate
   */

  return {
    deletedAccounts,
    newAccounts,
    updatedAccounts,
    similarAccounts,
  };
}
