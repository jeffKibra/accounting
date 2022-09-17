import { Transaction } from 'firebase/firestore';

import { getAccountData } from '../accounts';
import Summary from 'utils/summaries/summary';
import { JournalEntry } from 'utils/journals';
import InvoiceSale from 'utils/invoices/invoiceSale';

import { Org, Account, InvoiceFormData, CustomerSummary } from 'types';

interface OpeningBalanceData {
  accounts: Account[];
  org: Org;
  userId: string;
  invoiceId: string;
}

//------------------------------------------------------------------------------

export default class OpeningBalance extends InvoiceSale {
  OBAAccount: Account;
  salesAccount: Account;

  constructor(transaction: Transaction, data: OpeningBalanceData) {
    const { accounts, org, userId, invoiceId } = data;

    super(transaction, {
      accounts,
      invoiceId,
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
  }

  generateInvoice(openingBalance: number, customer: CustomerSummary) {
    const { salesAccount } = this;
    const invoiceForm: InvoiceFormData = {
      customer,
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

  create(obInvoice: InvoiceFormData) {
    const { transaction, org, salesAccount, OBAAccount, accounts } = this;
    const { orgId } = org;

    const {
      summary: { totalAmount },
      customer: { customerId },
    } = obInvoice;
    /**
     * create transaction details for journal entries
     */
    const summary = new Summary(transaction, orgId, accounts);
    /**
     * 1. debit sales account accountType= opening balance
     * 2. credit opening_balance_adjustments accountType= opening balance
     */
    summary.debitAccount(salesAccount.accountId, totalAmount);
    summary.creditAccount(OBAAccount.accountId, totalAmount);

    console.log({ summary });
    //update orgSummary
    summary.updateOrgSummary();
    //update customer summary
    summary.updateCustomerSummary(customerId);

    this.createWithoutSummary(obInvoice);
  }

  createWithoutSummary(obInvoice: InvoiceFormData) {
    const {
      transaction,
      org,
      salesAccount,
      OBAAccount,
      invoiceRef,
      userId,
      transactionId,
    } = this;
    const { orgId } = org;

    const {
      summary: { totalAmount },
    } = obInvoice;
    /**
     * create transaction details for journal entries
     */
    const transactionDetails = {
      ...obInvoice,
      transactionId: invoiceRef.id,
    };

    const accountsMapping = this.generateIncomeAccounts({
      saleDetails: obInvoice,
      saleAccount: salesAccount,
    });

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
      amount: 0 - totalAmount,
      account: salesAccount,
      reference: '',
      transactionDetails,
      transactionId,
      transactionType: 'opening_balance',
    });
    /**
     * 2. credit opening_balance_adjustments entry for customer opening balance
     */
    journalEntry.createEntry({
      amount: +totalAmount,
      account: OBAAccount,
      reference: '',
      transactionDetails,
      transactionId,
      transactionType: 'opening_balance',
    });

    this.createInvoice(obInvoice, accountsMapping);
  }

  async update(incomingOBInvoice: InvoiceFormData) {
    const {
      transaction,
      salesAccount,
      OBAAccount,
      org,
      userId,
      accounts,
      transactionId,
    } = this;
    const { orgId } = org;

    const journalEntry = new JournalEntry(transaction, userId, orgId);

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
        transactionId,
        'opening_balance'
      ),
      JournalEntry.getAccountEntryForTransaction(
        orgId,
        OBAAccount.accountId,
        transactionId,
        'opening_balance'
      ),
    ]);

    const {
      summary: { totalAmount: incomingAmount },
    } = incomingOBInvoice;
    const {
      summary: { totalAmount: currentAmount },
      customer: { customerId },
    } = currentOBInvoice;

    const { accountsMapping, entriesToDelete, entriesToUpdate } =
      await this.initUpdateSale(
        {
          saleDetails: incomingOBInvoice,
          saleAccount: salesAccount,
        },
        {
          saleDetails: currentOBInvoice,
          saleAccount: salesAccount,
        }
      );

    const summary = new Summary(transaction, orgId, accounts);
    /**
     * compute adjustment
     */
    const adjustment = incomingAmount - currentAmount;
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
      amount: 0 - incomingAmount,
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
      amount: incomingAmount,
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
    this.updateInvoice(
      incomingOBInvoice,
      accountsMapping,
      incomingAmount,
      entriesToUpdate,
      entriesToDelete
    );
  }

  async delete() {
    const {
      transaction,
      transactionId,
      org,
      accounts,
      salesAccount,
      OBAAccount,
      userId,
    } = this;
    const { orgId } = org;
    const summary = new Summary(transaction, orgId, accounts);

    const [currentOBInvoice, salesEntry, OBAEntry] = await Promise.all([
      this.getCurrentInvoice(),
      JournalEntry.getAccountEntryForTransaction(
        orgId,
        salesAccount.accountId,
        transactionId,
        'opening_balance'
      ),
      JournalEntry.getAccountEntryForTransaction(
        orgId,
        OBAAccount.accountId,
        transactionId,
        'opening_balance'
      ),
    ]);

    const { entriesToDelete } = await this.initDeleteSale({
      saleDetails: currentOBInvoice,
      saleAccount: salesAccount,
    });

    const {
      summary: { totalAmount: amount },
      customer: { customerId },
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
    //update summaries
    summary.updateOrgSummary();
    summary.updateCustomerSummary(customerId);

    /**
     * delete invoice
     */
    this.deleteInvoice(currentOBInvoice, entriesToDelete);
  }
}
