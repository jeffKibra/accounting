import { getAccountsMapping, getIncomeAccountsMapping } from "../accounts";
/**
 *
 * @typedef {import('.').invoice} invoice
 * @typedef {import('../sales').salesIte} salesItem
 * @typedef {import('../accounts').accountsMapping} accountsMapping
 */
/**
 *
 * @param {invoice} currentInvoice
 * @param {invoice} incomingInvoice
 * @returns {accountsMapping} accountsMapping
 */

import {
  Invoice,
  InvoiceFormData,
  InvoiceFormWithId,
  InvoiceUpdateData,
} from "../../types";

export default function mapInvoiceAccounts(
  currentInvoice:
    | Invoice
    | InvoiceFormData
    | InvoiceFormWithId
    | InvoiceUpdateData,
  incomingInvoice:
    | Invoice
    | InvoiceFormData
    | InvoiceFormWithId
    | InvoiceUpdateData
) {
  const { summary, selectedItems, customerId } = incomingInvoice;
  const { totalTaxes, shipping, adjustment, totalAmount } = summary;

  const {
    customerId: currentCustomerId,
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
