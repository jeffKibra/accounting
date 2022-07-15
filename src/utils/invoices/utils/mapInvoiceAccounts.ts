import { getAccountsMapping, getIncomeAccountsMapping } from "../../accounts";

import { Invoice, InvoiceFormData } from "../../../types";

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
    selectedItems: items,
    summary: currentSummary,
  } = currentInvoice;
  /**
   * check if customer has been changed
   */
  const customerHasChanged = currentCustomerId !== customerId;

  let { deletedAccounts, newAccounts, updatedAccounts, similarAccounts } =
    getIncomeAccountsMapping(items, selectedItems);
  const summaryAccounts = getAccountsMapping([
    {
      accountId: "shipping_charge",
      current: currentSummary.shipping,
      incoming: shipping,
    },
    {
      accountId: "other_charges",
      current: currentSummary.adjustment,
      incoming: adjustment,
    },
    {
      accountId: "tax_payable",
      current: currentSummary.totalTaxes,
      incoming: totalTaxes,
    },
    {
      accountId: "accounts_receivable",
      current: currentSummary.totalAmount,
      incoming: totalAmount,
    },
  ]);

  deletedAccounts = [...deletedAccounts, ...summaryAccounts.deletedAccounts];
  newAccounts = [...newAccounts, ...summaryAccounts.newAccounts];
  updatedAccounts = [...updatedAccounts, ...summaryAccounts.updatedAccounts];
  similarAccounts = [...similarAccounts, ...summaryAccounts.similarAccounts];

  /**
   * update accounts to update if also customer has changed
   */
  const accountsToUpdate = customerHasChanged
    ? [...updatedAccounts, ...similarAccounts]
    : updatedAccounts;
  /**
   * get entries data for deletedAccounts and accountsToUpdate
   */

  return {
    deletedAccounts,
    newAccounts,
    updatedAccounts: accountsToUpdate,
    similarAccounts,
  };
}
