import { increment, Transaction, FieldValue } from 'firebase/firestore';
import { getAccountsMapping, getAccountData } from '../accounts';
import { JournalEntry } from '../journals';

import { getItemsAccounts } from '.';
import MonthlySummary from '../summaries/monthlySummary';

import {
  AccountsMapping,
  InvoiceFormData,
  SalesReceiptForm,
  Account,
  Org,
  MappedEntry,
  SaleTransactionTypes,
} from 'types';

type SaleData = InvoiceFormData | SalesReceiptForm;
type TransactionType = keyof SaleTransactionTypes;

//----------------------------------------------------------------

interface SaleDetails {
  transactionId: string;
  userId: string;
  org: Org;
  accounts: Account[];
  transactionType: TransactionType;
}

export interface SaleDataAndAccount {
  saleDetails: SaleData;
  saleAccount: Account;
}

interface SummaryObject {
  [key: string]: number | FieldValue;
}

interface CustomerSummaryWithId {
  id: string;
  summary: SummaryObject;
}
interface CustomersChangeData {
  incomingCustomer: CustomerSummaryWithId;
  currentCustomer: CustomerSummaryWithId;
}

export default class Sale {
  protected transaction: Transaction;

  transactionId: string;
  org: Org;
  userId: string;
  accounts: Account[];
  transactionType: TransactionType;

  constructor(transaction: Transaction, saleDetails: SaleDetails) {
    const { accounts, org, transactionId, transactionType, userId } =
      saleDetails;

    this.transaction = transaction;
    this.transactionId = transactionId;
    this.userId = userId;
    this.org = org;
    this.accounts = accounts;
    this.transactionType = transactionType;
  }

  generateIncomeAccounts(
    incomingData: SaleDataAndAccount | null,
    currentData?: SaleDataAndAccount | null
  ) {
    if (!incomingData && !currentData) {
      throw new Error(
        'Please provide atleast either the current or the incoming sale data'
      );
    }
    const incomingSale = incomingData?.saleDetails;
    const incomingSaleAccount = incomingData?.saleAccount;

    const currentSale = currentData?.saleDetails;
    const currentSaleAccount = currentData?.saleAccount;

    const currentSummary = currentSale?.summary;
    const currentAccounts =
      currentSale && currentSaleAccount && currentSummary
        ? [
            ...getItemsAccounts(currentSale.selectedItems),
            {
              accountId: 'shipping_charge',
              amount: currentSummary.shipping || 0,
            },
            {
              accountId: 'other_charges',
              amount: currentSummary.adjustment || 0,
            },
            { accountId: 'tax_payable', amount: currentSummary.totalTax || 0 },
            {
              accountId: currentSaleAccount.accountId,
              amount: currentSummary.totalAmount || 0,
            },
          ]
        : [];

    const incomingSummary = incomingSale?.summary;
    const incomingAccounts =
      incomingSale && incomingSaleAccount && incomingSummary
        ? [
            ...getItemsAccounts(incomingSale.selectedItems),
            {
              accountId: 'shipping_charge',
              amount: incomingSummary.shipping || 0,
            },
            {
              accountId: 'other_charges',
              amount: incomingSummary.adjustment || 0,
            },
            {
              accountId: 'tax_payable',
              amount: incomingSummary.totalTax || 0,
            },
            {
              accountId: incomingSaleAccount.accountId,
              amount: incomingSummary.totalAmount || 0,
            },
          ]
        : [];

    const accountsMapping = getAccountsMapping(
      currentAccounts,
      incomingAccounts
    );

    return accountsMapping;
  }

  async fetchEntriesToUpdate(
    accountsMapping: AccountsMapping,
    customerHasChanged: boolean
  ) {
    const {
      org: { orgId },
      transactionId,
      transactionType,
    } = this;

    const { similarAccounts, updatedAccounts } = accountsMapping;
    const accountsToUpdate = customerHasChanged
      ? [...updatedAccounts, ...similarAccounts]
      : [...updatedAccounts];

    const entries = await JournalEntry.getAccountsEntriesForTransaction(
      orgId,
      transactionId,
      transactionType,
      accountsToUpdate
    );

    return entries;
  }

  async fetchEntriesToDelete(accountsMapping: AccountsMapping) {
    const {
      org: { orgId },
      transactionId,
      transactionType,
    } = this;
    const { deletedAccounts } = accountsMapping;

    const entries = await JournalEntry.getAccountsEntriesForTransaction(
      orgId,
      transactionId,
      transactionType,
      deletedAccounts
    );

    return entries;
  }

  generateAccountsSummary(accountsMapping: AccountsMapping) {
    const { uniqueAccounts } = accountsMapping;

    const accountsAdjustments = uniqueAccounts.reduce<{
      [key: string]: FieldValue;
    }>((accounts, accountMapping) => {
      const { accountId, current, incoming } = accountMapping;
      const adjustment = incoming - current;

      return {
        ...accounts,
        [`accounts.${accountId}`]: increment(adjustment),
      };
    }, {});

    return accountsAdjustments;
  }

  //writing methods

  createJournalEntries(
    accountsMapping: AccountsMapping,
    incomingSale: SaleData
  ) {
    const {
      transaction,
      userId,
      org: { orgId },
      accounts,
      transactionId,
      transactionType,
    } = this;

    const { newAccounts } = accountsMapping;
    console.log('creating entries', newAccounts, { transactionId });
    const journalEntry = new JournalEntry(transaction, userId, orgId);

    newAccounts.forEach(mappedAccount => {
      const { accountId, incoming } = mappedAccount;

      const incomeAccount = getAccountData(accountId, accounts);

      journalEntry.createEntry({
        account: incomeAccount,
        amount: incoming,
        reference: '',
        transactionId,
        transactionType,
        transactionDetails: { ...incomingSale },
      });
    });
  }

  updateJournalEntries(entries: MappedEntry[], incomingSale: SaleData) {
    const {
      transaction,
      transactionId,
      userId,
      org: { orgId },
      transactionType,
    } = this;

    const journalEntry = new JournalEntry(transaction, userId, orgId);
    entries?.forEach(entry => {
      const { account, credit, debit, entryId, incoming } = entry;

      journalEntry.updateEntry(entryId, {
        account,
        amount: incoming,
        credit,
        debit,
        entryId,
        reference: '',
        transactionId,
        transactionType,
        transactionDetails: { ...incomingSale },
      });
    });
  }

  deleteJournalEntries(entries: MappedEntry[]) {
    const {
      transaction,
      userId,
      org: { orgId },
    } = this;

    const journalEntry = new JournalEntry(transaction, userId, orgId);
    entries.forEach(entry => {
      const { entryId } = entry;
      journalEntry.deleteEntry(entryId);
    });
  }

  async changeCustomers(data: CustomersChangeData) {
    const {
      transaction,
      org: { orgId },
    } = this;
    const { incomingCustomer, currentCustomer } = data;

    const incomingCustomerSummary = new MonthlySummary(transaction, orgId);
    const currentCustomerSummary = new MonthlySummary(transaction, orgId);

    incomingCustomerSummary.appendObject({
      ...incomingCustomer.summary,
    });
    currentCustomerSummary.appendObject({
      ...currentCustomer.summary,
    });

    //update
    currentCustomerSummary.updateCustomerSummary(currentCustomer.id);
    incomingCustomerSummary.updateCustomerSummary(incomingCustomer.id);
  }

  async getChangedCustomersAccountsSummaries(
    incomingSaleAndAccount: SaleDataAndAccount,
    currentSaleAndAccount: SaleDataAndAccount
  ) {
    //delete values from previous customer

    const currentCustomerAccountMapping = this.generateIncomeAccounts(
      null,
      currentSaleAndAccount
    );
    const currentCustomerAccountsSummary = this.generateAccountsSummary(
      currentCustomerAccountMapping
    );

    //add new values to the incoming customer

    const incomingCustomerAccountMapping = this.generateIncomeAccounts(
      incomingSaleAndAccount
    );
    const incomingCustomerAccountsSummary = this.generateAccountsSummary(
      incomingCustomerAccountMapping
    );

    return {
      incomingCustomerAccountsSummary,
      currentCustomerAccountsSummary,
    };
  }

  protected initCreateSale(
    incomingSale: SaleData,
    incomingSaleAccount: Account
  ) {
    const accountsMapping = this.generateIncomeAccounts({
      saleDetails: incomingSale,
      saleAccount: incomingSaleAccount,
    });

    const accountsSummary = this.generateAccountsSummary(accountsMapping);

    return { accountsMapping, accountsSummary };
  }

  protected createSale(
    incomingSale: SaleData,
    accountsMapping: AccountsMapping
  ) {
    this.createJournalEntries(accountsMapping, incomingSale);
  }

  protected async initUpdateSale(
    incomingSaleAndAccount: SaleDataAndAccount,
    currentSaleAndAccount: SaleDataAndAccount
  ) {
    const accountsMapping = this.generateIncomeAccounts(
      incomingSaleAndAccount,
      currentSaleAndAccount
    );
    const accountsSummary = this.generateAccountsSummary(accountsMapping);

    const [entriesToUpdate, entriesToDelete] = await Promise.all([
      this.fetchEntriesToUpdate(accountsMapping, false),
      this.fetchEntriesToDelete(accountsMapping),
    ]);

    return {
      accountsSummary,
      entriesToUpdate,
      entriesToDelete,
      accountsMapping,
    };
  }

  protected updateSale(
    incomingSale: SaleData,
    accountsMapping: AccountsMapping,
    entriesToUpdate: MappedEntry[],
    entriesToDelete: MappedEntry[]
  ) {
    this.createJournalEntries(accountsMapping, incomingSale);
    this.updateJournalEntries(entriesToUpdate, incomingSale);
    this.deleteJournalEntries(entriesToDelete);
  }

  protected async initDeleteSale(currentSaleAndAccount: SaleDataAndAccount) {
    const accountsMapping = this.generateIncomeAccounts(
      null,
      currentSaleAndAccount
    );
    const accountsSummary = this.generateAccountsSummary(accountsMapping);
    const entriesToDelete = await this.fetchEntriesToDelete(accountsMapping);

    return {
      accountsMapping,
      entriesToDelete,
      accountsSummary,
    };
  }

  protected deleteSale(entries: MappedEntry[]) {
    this.deleteJournalEntries(entries);
  }
}
