import {
  deleteSimilarAccountEntries,
  getAccountTransactionEntry,
} from "../journals";
import { deleteInvoiceFetch, deleteInvoiceWrite } from "../invoices";
import { getAccountData } from "../accounts";

export default async function deleteOB(
  transaction,
  orgId,
  userProfile,
  accounts,
  customerId
) {
  const invoiceId = customerId;
  const salesAccount = getAccountData("sales", accounts);
  const OBAAccount = getAccountData("opening_balance_adjustments", accounts);

  const [updateData, salesEntry, OBAEntry] = await Promise.all([
    deleteInvoiceFetch(transaction, orgId, invoiceId),
    getAccountTransactionEntry(
      orgId,
      salesAccount.accountId,
      customerId,
      "opening balance"
    ),
    getAccountTransactionEntry(
      orgId,
      OBAAccount.accountId,
      customerId,
      "opening balance"
    ),
  ]);
  /**
   * delete 2 journal entries
   */
  /**
   * 1. debit sales
   * to debit income, amount must be negative
   */
  deleteSimilarAccountEntries(transaction, userProfile, orgId, salesAccount, [
    {
      account: salesEntry.account,
      credit: salesEntry.credit,
      debit: salesEntry.debit,
      entryId: salesEntry.entryId,
    },
  ]);
  /**
   * 2. credit opening_balance_adjustments entry for customer opening balance
   */
  deleteSimilarAccountEntries(transaction, userProfile, orgId, OBAAccount, [
    {
      account: OBAEntry.account,
      credit: OBAEntry.credit,
      debit: OBAEntry.debit,
      entryId: OBAEntry.entryId,
    },
  ]);
  /**
   * create an invoice equivalent for for customer opening balance
   */
  const { invoice, groupedEntries } = updateData;
  deleteInvoiceWrite(
    transaction,
    orgId,
    userProfile,
    invoice,
    groupedEntries,
    "delete"
  );
}
