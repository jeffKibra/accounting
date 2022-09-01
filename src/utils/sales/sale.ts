import {
  Transaction,
  doc,
  DocumentReference,
  DocumentData,
  increment,
  FieldValue,
} from 'firebase/firestore';
import { getAccountsMapping, getAccountData } from '../accounts';
import {
  createEntry,
  updateEntry,
  deleteEntry,
  getAccountsEntriesForTransaction,
} from '../journals';
import { getDateDetails } from '../dates';
import { db } from '../firebase';
import Summary from '../summaries/summary';
import { getItemsAccounts } from '.';

import {
  AccountsMapping,
  InvoiceFormData,
  SalesReceiptForm,
  Account,
  Org,
  UserProfile,
  MappedEntry,
  SaleTransactionTypes,
} from 'types';

type SaleData = InvoiceFormData | SalesReceiptForm;
type TransactionType = keyof SaleTransactionTypes;

interface SaleDetails {
  transactionId: string;
  userProfile: UserProfile;
  org: Org;
  accounts: Account[];
  transactionType: TransactionType;
  incomingSaleData: SaleData | null;
  incomingSaleAccount: Account | null;
}

interface SummaryInstance extends Summary {}

export default class Sale {
  protected transaction: Transaction;

  transactionId: string;
  incomingSale: SaleData | null;
  incomingSaleAccount: Account | null;
  currentSale: SaleData | null;
  currentSaleAccount: Account | null;
  org: Org;
  userProfile: UserProfile;
  accounts: Account[];
  saleAccountsMapping: AccountsMapping | null;
  transactionType: TransactionType;
  customerHasChanged: boolean;

  //entries
  entriesToUpdate: MappedEntry[] | null;
  entriesToDelete: MappedEntry[] | null;
  //accounts summaries adjustments
  saleAccountsToUpdate: { [key: string]: number } | null;
  //firestore refs
  summaryRef: DocumentReference<DocumentData>;
  //summary
  dailySummary: { [key: string]: number | FieldValue } | null;
  summaryInstance: SummaryInstance;

  constructor(transaction: Transaction, saleDetails: SaleDetails) {
    const {
      accounts,
      org,
      transactionId,
      transactionType,
      userProfile,
      incomingSaleData,
      incomingSaleAccount,
    } = saleDetails;

    this.transaction = transaction;
    this.transactionId = transactionId;
    this.userProfile = userProfile;
    this.org = org;
    this.accounts = accounts;
    this.incomingSale = incomingSaleData;
    this.incomingSaleAccount = incomingSaleAccount;
    this.transactionType = transactionType;

    this.summaryInstance = new Summary(transaction, null, org);

    this.currentSale = null;
    this.currentSaleAccount = null;
    this.saleAccountsMapping = null;
    this.customerHasChanged = false;
    this.entriesToUpdate = null;
    this.entriesToDelete = null;
    this.saleAccountsToUpdate = null;

    this.dailySummary = null;
    const { yearMonthDay } = getDateDetails();
    this.summaryRef = doc(
      db,
      'organizations',
      org.orgId,
      'summaries',
      yearMonthDay
    );
  }

  generateIncomeAccounts() {
    const {
      incomingSale,
      currentSale,
      incomingSaleAccount,
      currentSaleAccount,
    } = this;

    if (!incomingSale && !currentSale) {
      throw new Error(
        'Please provide atleast either the current or the incoming sale data'
      );
    }

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
    this.saleAccountsMapping = accountsMapping;
  }

  async fetchEntriesToUpdate() {
    const {
      org: { orgId },
      transactionId,
      transactionType,
      saleAccountsMapping,
      customerHasChanged,
    } = this;
    if (saleAccountsMapping) {
      const { similarAccounts, updatedAccounts } = saleAccountsMapping;
      const accountsToUpdate = customerHasChanged
        ? [...updatedAccounts, ...similarAccounts]
        : [...updatedAccounts];

      const entries = await getAccountsEntriesForTransaction(
        orgId,
        transactionId,
        transactionType,
        accountsToUpdate
      );

      this.entriesToUpdate = entries;
    } else {
      console.log('Income accounts to update not found!');
    }
  }

  async fetchEntriesToDelete() {
    const {
      org: { orgId },
      transactionId,
      transactionType,
      saleAccountsMapping,
    } = this;
    if (saleAccountsMapping) {
      const { deletedAccounts } = saleAccountsMapping;

      const entries = await getAccountsEntriesForTransaction(
        orgId,
        transactionId,
        transactionType,
        deletedAccounts
      );

      this.entriesToDelete = entries;
    } else {
      console.log('Income accounts to delete not found!');
    }
  }

  generateAccountsSummary() {
    const { saleAccountsMapping } = this;
    if (saleAccountsMapping) {
      const { uniqueAccounts } = saleAccountsMapping;
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

      this.summaryInstance.appendObject(accountsAdjustments);
    } else {
      console.log(
        'Updating income accounts in summary not possible: No accounts to update'
      );
    }
  }

  //writing methods

  createJournalEntries() {
    const {
      transaction,
      saleAccountsMapping,
      userProfile,
      org: { orgId },
      accounts,
      transactionId,
      incomingSale,
      transactionType,
    } = this;

    if (saleAccountsMapping) {
      const { newAccounts } = saleAccountsMapping;
      console.log('creating entries', newAccounts, { transactionId });

      newAccounts.forEach(mappedAccount => {
        const { accountId, incoming } = mappedAccount;

        const incomeAccount = getAccountData(accountId, accounts);

        createEntry(transaction, userProfile, orgId, {
          account: incomeAccount,
          amount: incoming,
          reference: '',
          transactionId,
          transactionType,
          transactionDetails: { ...incomingSale },
        });
      });
    } else {
      console.warn('There are no Sale entries to create');
    }
  }

  updateJournalEntries() {
    const {
      transaction,
      transactionId,
      userProfile,
      org: { orgId },
      entriesToUpdate,
      transactionType,
      incomingSale,
    } = this;
    if (entriesToUpdate) {
      entriesToUpdate?.forEach(entry => {
        const { account, credit, debit, entryId, incoming } = entry;

        updateEntry(transaction, userProfile, orgId, {
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
    } else {
      console.warn('There are no Sale entries to update');
    }
  }

  deleteJournalEntries() {
    const {
      transaction,
      userProfile,
      org: { orgId },
      entriesToDelete,
    } = this;

    if (entriesToDelete) {
      entriesToDelete.forEach(entry => {
        const { entryId } = entry;
        deleteEntry(transaction, userProfile, orgId, entryId);
      });
    } else {
      console.warn('There are no Sale entries to delete');
    }
  }

  protected initCreateSale() {
    if (!this.incomingSale) {
      throw new Error('Incoming sale data not found');
    }
    this.generateIncomeAccounts();
    this.generateAccountsSummary();
  }

  protected createSale() {
    if (!this.saleAccountsMapping) {
      throw new Error('Initialize sale creation before creating new Sale');
    }
    this.createJournalEntries();
    //update summary
    this.summaryInstance.updateSummary();
  }

  protected async initUpdateSale() {
    if (!this.incomingSale || !this.currentSale) {
      throw new Error('Incoming or Current sale data not found');
    }

    this.generateIncomeAccounts();
    this.generateAccountsSummary();
    await Promise.all([
      this.fetchEntriesToUpdate(),
      this.fetchEntriesToDelete(),
    ]);
  }

  protected updateSale() {
    const { saleAccountsMapping } = this;

    if (!saleAccountsMapping) {
      throw new Error('Please initialize an update before updating');
    }

    this.createJournalEntries();
    this.updateJournalEntries();
    this.deleteJournalEntries();
    //update summary
    this.summaryInstance.updateSummary();
  }

  protected async initDeleteSale() {
    if (!this.currentSale) {
      throw new Error('Current sale data not found');
    }
    this.generateIncomeAccounts();
    this.generateAccountsSummary();
    await this.fetchEntriesToDelete();
  }

  protected deleteSale() {
    if (!this.entriesToDelete) {
      throw new Error(
        'Initialize sale deletion before deleting-no entries to delete'
      );
    }
    this.deleteJournalEntries();
    //update summary
    this.summaryInstance.updateSummary();
  }
}
