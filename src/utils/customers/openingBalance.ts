import { Transaction, serverTimestamp, Timestamp } from 'firebase/firestore';

import { getAccountData } from '../accounts';
import Summary from 'utils/summaries/summary';
import { JournalEntry } from 'utils/journals';
import formats from 'utils/formats';
import InvoiceSale from 'utils/invoices/invoiceSale';

import { Org, Account, InvoiceFormData, Customer } from 'types';

interface OpeningBalanceData {
  accounts: Account[];
  org: Org;
  userId: string;
  customer: Customer;
}

//------------------------------------------------------------------------------

export default class OpeningBalance extends InvoiceSale {
  customer: Customer;

  /**
   * opening_balance_adjustments account
   */
  OBAAccount: Account;
  salesAccount: Account;

  constructor(transaction: Transaction, data: OpeningBalanceData) {
    const { accounts, org, userId, customer } = data;

    super(transaction, {
      accounts,
      invoiceId: customer.customerId,
      org,
      userId,
      transactionType: 'customer_opening_balance',
    });

    const salesAccount = getAccountData('sales', accounts);
    const OBAAccount = getAccountData('opening_balance_adjustments', accounts);

    if (!salesAccount) {
      throw new Error('Sales account not found!');
    }
    if (!OBAAccount) {
      throw new Error('Opening balance adjustments account not found!');
    }

    this.salesAccount = salesAccount;
    this.OBAAccount = OBAAccount;

    this.customer = customer;
  }

  generateInvoice(openingBalance: number) {
    const { customer, salesAccount } = this;
    const invoiceForm: InvoiceFormData = {
      customer: formats.formatCustomerData(customer),
      invoiceDate: new Date(),
      dueDate: new Date(),
      orderNumber: '',
      subject: '',
      customerNotes: '',
      paymentTerm: { days: 0, name: 'Due on Receipt', value: 'on_receipt' },
      selectedItems: [
        {
          item: {
            itemId: 'customer_opening_balance',
            name: 'customer opening balance',
            salesAccount,
            sellingPrice: openingBalance,
            unit: '',
            sku: 'customer_opening_balance',
            skuOption: '',
            type: '',
          },
          quantity: 1,
          itemRate: openingBalance,
          rate: openingBalance,
          itemRateTotal: openingBalance,
          itemTax: 0,
          itemTaxTotal: 0,
        },
      ],
      summary: {
        shipping: 0,
        adjustment: 0,
        subTotal: openingBalance,
        taxType: '',
        taxes: [],
        totalTax: 0,
        totalAmount: openingBalance,
      },
    };

    return invoiceForm;
  }

  create(amount: number) {
    const {
      transaction,
      org,
      customer: { customerId },
      salesAccount,
      OBAAccount,
      accounts,
      invoiceRef,
      userId,
    } = this;
    const { orgId } = org;
    /**
     * create transaction details for journal entries
     */
    const obInvoice = this.generateInvoice(amount);
    const transactionDetails = {
      ...obInvoice,
      transactionId: invoiceRef.id,
    };

    const summary = new Summary(transaction, orgId, accounts);
    /**
     * create 2 journal entries
     * 1. debit accounts_receivable accountType= opening balance
     * 2. credit opening_balance_adjustments accountType= opening balance
     */
    /**
     * 1. debit sales
     * to debit income, amount must be negative
     */
    const journalEntry = new JournalEntry(transaction, userId, orgId);
    journalEntry.createEntry({
      amount: 0 - amount,
      account: salesAccount,
      reference: '',
      transactionDetails,
      transactionId: customerId,
      transactionType: 'opening_balance',
    });
    summary.debitAccount(salesAccount.accountId, amount);
    /**
     * 2. credit opening_balance_adjustments entry for customer opening balance
     */
    journalEntry.createEntry({
      amount: +amount,
      account: OBAAccount,
      reference: '',
      transactionDetails,
      transactionId: customerId,
      transactionType: 'opening_balance',
    });
    summary.creditAccount(OBAAccount.accountId, amount);

    console.log({ summary });
    //update orgSummary
    summary.updateOrgSummary();
    //update customer summary
    summary.updateCustomerSummary(customerId);

    transaction.set(this.invoiceRef, {
      ...obInvoice,
      balance: amount,
      paymentsReceived: {},
      paymentsIds: [],
      paymentsCount: 0,
      status: 0,
      isSent: false,
      transactionType: 'customer_opening_balance',
      org: formats.formatOrgData(org),
      createdBy: userId,
      createdAt: serverTimestamp() as Timestamp,
      modifiedBy: userId,
      modifiedAt: serverTimestamp() as Timestamp,
    });
  }

  async update(amount: number) {
    const {
      transaction,
      salesAccount,
      OBAAccount,
      customer: { customerId },
      org,
      userId,
      accounts,
      transactionId,
    } = this;
    const { orgId } = org;

    const journalEntry = new JournalEntry(transaction, userId, orgId);
    const incomingOBInvoice = this.generateInvoice(amount);

    const transactionDetails = {
      ...incomingOBInvoice,
      transactionId: transactionId,
    };

    /**
     * fetch data
     */
    const [currentOBInvoice, salesEntry, OBAEntry] = await Promise.all([
      this.getCurrentInvoice(),
      JournalEntry.getAccountEntryForTransaction(
        orgId,
        salesAccount.accountId,
        customerId,
        'opening_balance'
      ),
      JournalEntry.getAccountEntryForTransaction(
        orgId,
        OBAAccount.accountId,
        customerId,
        'opening_balance'
      ),
    ]);
    const {
      summary: { totalAmount: currentAmount },
    } = currentOBInvoice;

    const summary = new Summary(transaction, orgId, accounts);
    /**
     * compute adjustment
     */
    const adjustment = amount - currentAmount;
    console.log({ adjustment });
    /**
     * update 2 journal entries
     * 1. debit sales transactionType= opening balance
     * 2. credit opening_balance_adjustments transactionType= opening balance
     */
    /**
     * 1. debit sales
     * to debit income, amount must be negative
     */
    journalEntry.updateEntry(salesEntry.entryId, {
      amount: 0 - amount,
      account: salesEntry.account,
      credit: salesEntry.credit,
      debit: salesEntry.debit,
      entryId: salesEntry.entryId,
      transactionDetails,
    });
    summary.debitAccount(salesAccount.accountId, adjustment);
    /**
     * 2. credit opening_balance_adjustments entry for customer opening balance
     */
    journalEntry.updateEntry(OBAEntry.entryId, {
      amount,
      account: OBAEntry.account,
      credit: OBAEntry.credit,
      debit: OBAEntry.debit,
      entryId: OBAEntry.entryId,
      transactionDetails,
    });
    summary.creditAccount(OBAAccount.accountId, adjustment);

    //update summaries
    summary.updateOrgSummary();
    summary.updateCustomerSummary(customerId);
    /**
     * update invoice
     */
    transaction.update(this.invoiceRef, {
      ...incomingOBInvoice,
      modifiedAt: serverTimestamp() as Timestamp,
      modifiedBy: userId,
    });
  }

  async delete(customerId: string) {
    const { transaction, org, accounts, salesAccount, OBAAccount, userId } =
      this;
    const { orgId } = org;
    const summary = new Summary(transaction, orgId, accounts);

    const [currentOBInvoice, salesEntry, OBAEntry] = await Promise.all([
      this.getCurrentInvoice(),
      JournalEntry.getAccountEntryForTransaction(
        orgId,
        salesAccount.accountId,
        customerId,
        'opening_balance'
      ),
      JournalEntry.getAccountEntryForTransaction(
        orgId,
        OBAAccount.accountId,
        customerId,
        'opening_balance'
      ),
    ]);

    const {
      summary: { totalAmount: amount },
    } = currentOBInvoice;
    /**
     * delete 2 journal entries
     */
    /**
     * 1. delete accounts_receivable entry for opening_balance
     */
    const journalEntry = new JournalEntry(transaction, userId, orgId);
    journalEntry.deleteEntry(salesEntry.entryId);

    summary.creditAccount(salesAccount.accountId, amount);
    /**
     * 2. delete opening_balance_adjustments entry
     */
    journalEntry.deleteEntry(OBAEntry.entryId);
    summary.debitAccount(OBAAccount.accountId, amount);

    summary.updateOrgSummary();
    summary.updateCustomerSummary(customerId);

    /**
     * delete invoice
     */
    transaction.update(this.invoiceRef, {
      status: -1,
      modifiedAt: serverTimestamp(),
      modifiedBy: userId,
    });
  }
}
