import {
  deleteSimilarAccountEntries,
  getAccountEntryForTransaction,
} from '../journals';
import { fetchInvoiceDeletionData, deleteInvoice } from '../invoices';
import { getAccountData } from '../accounts';

import Summary from 'utils/summaries/summary';
import InvoiceSale from '../invoices/invoiceSale';
import JournalEntry from '../journals/journalEntry';

import { Transaction } from 'firebase/firestore';
import { UserProfile, Account } from '../../types';

export default async function deleteOB(
  transaction: Transaction,
  orgId: string,
  userId: string,
  accounts: Account[],
  customerId: string
) {
  const summary = new Summary(transaction, orgId);

  const invoiceId = customerId;
  const salesAccount = getAccountData('sales', accounts);
  const OBAAccount = getAccountData('opening_balance_adjustments', accounts);

  const [updateData, entries] = await Promise.all([
    fetchInvoiceDeletionData(transaction, orgId, invoiceId),
    JournalEntry.getTransactionEntries(orgId, customerId, 'opening_balance'),
  ]);
  console.log({ updateData });
  console.log({ salesAccount, OBAAccount });
  /**
   * delete 2 journal entries
   */
  /**
   * 1. debit sales
   * to debit income, amount must be negative
   */
  const journalEntry = new JournalEntry(transaction, userId, orgId);

  entries.forEach(entry => {
    journalEntry.deleteEntry(entry.entryId);
  });

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
  deleteInvoice(
    transaction,
    orgId,
    userProfile,
    invoice,
    groupedEntries,
    'delete'
  );
}
