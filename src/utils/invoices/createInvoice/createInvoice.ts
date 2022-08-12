import {
  doc,
  serverTimestamp,
  increment,
  Transaction,
} from 'firebase/firestore';

import { db, dbCollections } from '../../firebase';
import { getAccountData, getAccountsMapping } from '../../accounts';
import { createSimilarAccountEntries } from '../../journals';
import formats from '../../formats';
import { getDateDetails } from '../../dates';
import { formatSalesItems } from '../../sales';

import {
  Org,
  UserProfile,
  Account,
  InvoiceFormData,
  InvoiceFromDb,
  InvoiceTransactionTypes,
} from 'types';

interface TDetails
  extends Omit<
    InvoiceFromDb,
    'createdAt' | 'createdBy' | 'modifiedAt' | 'modifiedBy'
  > {}

export default function createInvoice(
  transaction: Transaction,
  org: Org,
  userProfile: UserProfile,
  accounts: Account[],
  invoiceId: string,
  data: InvoiceFormData,
  transactionType: keyof InvoiceTransactionTypes = 'invoice'
) {
  console.log('creating invoice', transactionType, data);
  const { orgId } = org;
  const { email } = userProfile;
  const { customer, summary, selectedItems } = data;
  const { totalAmount, shipping, adjustment, totalTax } = summary;
  const { customerId } = customer;
  /**
   * accounts details
   */
  const { yearMonthDay } = getDateDetails();

  // console.log({ selectedItems });

  const tDetails: TDetails = {
    ...data,
    balance: summary.totalAmount,
    paymentsReceived: {},
    paymentsIds: [],
    paymentsCount: 0,
    status: 'active',
    isSent: false,
    transactionType,
    org: formats.formatOrgData(org),
  };
  const transactionDetails = {
    ...tDetails,
    invoiceId,
  };
  const transactionId = invoiceId;
  const reference = '';

  /**
   * create journal entries for income accounts
   */
  const allItems = [
    ...formatSalesItems(selectedItems),
    { accountId: 'shipping_charge', amount: shipping || 0 },
    { accountId: 'other_charges', amount: adjustment || 0 },
    { accountId: 'tax_payable', amount: totalTax || 0 },
    { accountId: 'accounts_receivable', amount: totalAmount },
  ];
  const { newAccounts } = getAccountsMapping([], allItems);
  /**
   * create all accounts
   */
  newAccounts.forEach(newAccount => {
    const { accountId, incoming } = newAccount;
    const salesAccount = getAccountData(accountId, accounts);

    createSimilarAccountEntries(transaction, userProfile, orgId, salesAccount, [
      {
        amount: incoming,
        account: salesAccount,
        reference,
        transactionId,
        transactionType,
        transactionDetails,
      },
    ]);
  });
  /**
   * since an invoice is also created for customer opening balances
   * use the isInvoice tag to check whether to create:
   * -customer summary and
   * -org summary
   */
  if (transactionType === 'invoice') {
    /**
     * update customer summaries
     */
    const customersCollections = dbCollections(orgId).customers;
    const customerRef = doc(customersCollections, customerId);

    transaction.update(customerRef, {
      'summary.invoices': increment(1),
      'summary.invoicedAmount': increment(totalAmount),
    });
    /**
     * update org summaries
     */
    const summaryRef = doc(
      db,
      'organizations',
      orgId,
      'summaries',
      yearMonthDay
    );
    transaction.update(summaryRef, {
      invoices: increment(1),
    });
  }
  /**
   * create invoice
   */
  const invoicesCollection = dbCollections(orgId).invoices;
  const invoiceRef = doc(invoicesCollection, invoiceId);

  console.log({ tDetails });
  transaction.set(invoiceRef, {
    ...tDetails,
    createdBy: email,
    createdAt: serverTimestamp(),
    modifiedBy: email,
    modifiedAt: serverTimestamp(),
  });
}
