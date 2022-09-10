import { Transaction } from 'firebase/firestore';

import { JournalEntry } from '../journals';
import { getAccountData } from '../accounts';
import Summary from 'utils/summaries/summary';
import InvoiceSale from '../invoices/invoiceSale';

import { Org, Account, CustomerFormData, InvoiceFormData } from '../../types';

export default function createOB(
  transaction: Transaction,
  org: Org,
  userId: string,
  accounts: Account[],
  customerId: string,
  customer: CustomerFormData,
  openingBalance: number
) {
  const { orgId } = org;
  const { paymentTerm } = customer;
  /**
   * create transaction details for journal entries
   */
  const transactionDetails = {
    ...customer,
    customerId,
    status: 'active',
  };

  const summary = new Summary(transaction, orgId);
  /**
   * create 2 journal entries
   * 1. debit sales accountType= opening balance
   * 2. credit opening_balance_adjustments accountType= opening balance
   */
  /**
   * 1. debit sales
   * to debit income, amount must be negative
   */
  const journalEntry = new JournalEntry(transaction, userId, orgId);
  const sales = getAccountData('sales', accounts);
  journalEntry.createEntry({
    amount: 0 - openingBalance,
    account: sales,
    reference: '',
    transactionDetails,
    transactionId: customerId,
    transactionType: 'opening_balance',
  });
  summary.appendAccount(sales.accountId, 0, openingBalance);

  /**
   * 2. credit opening_balance_adjustments entry for customer opening balance
   */
  const obAdjustments = getAccountData('opening_balance_adjustments', accounts);
  journalEntry.createEntry({
    amount: +openingBalance,
    account: obAdjustments,
    reference: '',
    transactionDetails,
    transactionId: customerId,
    transactionType: 'opening_balance',
  });
  summary.appendAccount(obAdjustments.accountId, openingBalance, 0);

  /**
   * create an invoice equivalent for for customer opening balance
   */
  const invoiceId = customerId;
  const salesAccount = getAccountData('sales', accounts);
  const invoiceData: InvoiceFormData = {
    customer: transactionDetails,
    invoiceDate: new Date(),
    dueDate: new Date(),
    paymentTerm,
    summary: {
      totalAmount: openingBalance,
      adjustment: 0,
      shipping: 0,
      subTotal: openingBalance,
      taxType: '',
      taxes: [],
      totalTax: 0,
    },
    selectedItems: [
      {
        item: {
          salesAccount,
          itemId: customerId,
          name: customer.displayName,
          sellingPrice: openingBalance,
          sku: '',
          skuOption: '',
          type: '',
          unit: '',
        },
        rate: openingBalance,
        itemRate: openingBalance,
        itemTax: 0,
        quantity: 1,
        itemTaxTotal: 0,
        itemRateTotal: openingBalance,
      },
    ],
    customerNotes: '',
    subject: '',
    orderNumber: '',
  };

  const invoiceInstance = new InvoiceSale(transaction, {
    accounts,
    invoiceId,
    org,
    userId,
    transactionType: 'customer_opening_balance',
  });
  const ARAccount = invoiceInstance.ARAccount;

  const accountsMapping = invoiceInstance.generateIncomeAccounts({
    saleDetails: invoiceData,
    saleAccount: ARAccount,
  });
  const accountsSummary =
    invoiceInstance.generateAccountsSummary(accountsMapping);

  summary.appendObject(accountsSummary);
  console.log({ summary });
  //update orgSummary
  summary.updateOrgSummary();
  //update customer summary
  summary.updateCustomerSummary(customerId);

  invoiceInstance.createInvoice(invoiceData, accountsMapping);
}
