import { getAccountData } from '../accounts';

import Summary from 'utils/summaries/summary';
import InvoiceSale from '../invoices/invoiceSale';
import JournalEntry from '../journals/journalEntry';

import { Transaction } from 'firebase/firestore';
import { Org, Account } from '../../types';

export default async function deleteOB(
  transaction: Transaction,
  org: Org,
  userId: string,
  accounts: Account[],
  invoiceId: string,
  customerId: string
) {
  const { orgId } = org;
  const summary = new Summary(transaction, orgId, accounts);

  const salesAccount = getAccountData('sales', accounts);
  const OBAAccount = getAccountData('opening_balance_adjustments', accounts);

  const invoiceSale = new InvoiceSale(transaction, {
    accounts,
    invoiceId,
    org,
    transactionType: 'customer_opening_balance',
    userId,
  });

  const [invoice, invoiceEntries, salesEntry, OBAEntry] = await Promise.all([
    invoiceSale.getCurrentInvoice(),
    JournalEntry.getTransactionEntries(
      orgId,
      invoiceId,
      'customer_opening_balance'
    ),
    JournalEntry.getAccountEntryForTransaction(
      orgId,
      salesAccount.accountId,
      invoiceId,
      'opening_balance'
    ),
    JournalEntry.getAccountEntryForTransaction(
      orgId,
      OBAAccount.accountId,
      invoiceId,
      'opening_balance'
    ),
  ]);

  console.log({ invoice, invoiceEntries });
  console.log({ salesAccount, OBAAccount });
  const { totalAmount } = invoice.summary;
  /**
   * delete 2 journal entries
   */
  /**
   * 1. delete sales entry for opening_balance
   * dont adjust the accounts summary as sales cancel out with the
   * invoice sales
   */
  const journalEntry = new JournalEntry(transaction, userId, orgId);
  journalEntry.deleteEntry(salesEntry.entryId);

  /**
   * 2. delete opening_balance_adjustments entry
   * debit opening_balance_adjustments entry for customer opening balance
   */
  journalEntry.deleteEntry(OBAEntry.entryId);
  summary.debitAccount(OBAAccount.accountId, totalAmount);
  /**
   * credit accounts_receivable,
   * the sales account is balanced by opening_balance sales
   */
  summary.creditAccount('accounts_receivable', totalAmount);

  summary.updateOrgSummary();
  summary.updateCustomerSummary(customerId);

  /**
   * delete invoice
   */
  invoiceSale.deleteInvoice(invoice, invoiceEntries);
}
