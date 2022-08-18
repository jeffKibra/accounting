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

export default class Sale {
  protected transaction: Transaction;

  transactionId: string;
  incomingSale: SaleData;
  _currentSale: SaleData | null;
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

  constructor(
    transaction: Transaction,
    transactionId: string,
    userProfile: UserProfile,
    org: Org,
    saleData: SaleData,
    accounts: Account[],
    transactionType: TransactionType
  ) {
    this.transaction = transaction;
    this.transactionId = transactionId;
    this.userProfile = userProfile;
    this.org = org;
    this.accounts = accounts;
    this.incomingSale = saleData;
    this.transactionType = transactionType;

    this._currentSale = null;
    this.saleAccountsMapping = null;
    this.customerHasChanged = false;
    this.entriesToUpdate = null;
    this.entriesToDelete = null;
    this.saleAccountsToUpdate = null;
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
    const { incomingSale, _currentSale } = this;
    const currentSummary = _currentSale?.summary;
    const currentAccounts = _currentSale
      ? [
          ...getItemsAccounts(_currentSale.selectedItems),
          {
            accountId: 'shipping_charge',
            amount: currentSummary?.shipping || 0,
          },
          {
            accountId: 'other_charges',
            amount: currentSummary?.adjustment || 0,
          },
          { accountId: 'tax_payable', amount: currentSummary?.totalTax || 0 },
        ]
      : [];

    const incomingSummary = incomingSale.summary;
    const incomingAccounts = [
      ...getItemsAccounts(incomingSale.selectedItems),
      {
        accountId: 'shipping_charge',
        amount: incomingSummary.shipping || 0,
      },
      { accountId: 'other_charges', amount: incomingSummary.adjustment || 0 },
      { accountId: 'tax_payable', amount: incomingSummary.totalTax || 0 },
    ];

    const accountsMapping = getAccountsMapping(
      currentAccounts,
      incomingAccounts
    );
    this.saleAccountsMapping = accountsMapping;
  }

  fetchEntriesToUpdate() {
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

      return getAccountsEntriesForTransaction(
        orgId,
        transactionId,
        transactionType,
        accountsToUpdate
      );
    } else {
      console.log('Income accounts to update not found!');
    }
  }

  fetchEntriesToDelete() {
    const {
      org: { orgId },
      transactionId,
      transactionType,
      saleAccountsMapping,
    } = this;
    if (saleAccountsMapping) {
      const { deletedAccounts } = saleAccountsMapping;

      return getAccountsEntriesForTransaction(
        orgId,
        transactionId,
        transactionType,
        deletedAccounts
      );
    } else {
      console.log('Income accounts to delete not found!');
    }
  }

  set currentSale(sale: SaleData) {
    this._currentSale = sale;
  }

  //methods to initialize for creating, updating and deleting
  initCreate() {
    this.generateIncomeAccounts();
  }

  initUpdate() {
    this.generateIncomeAccounts();
    this.fetchEntriesToUpdate();
    this.fetchEntriesToDelete();
  }

  initDelete() {
    this.generateIncomeAccounts();
    this.fetchEntriesToDelete();
  }

  //writing methods
  updateAccountsInSummary() {
    const { saleAccountsMapping, transaction, summaryRef } = this;
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

      transaction.update(summaryRef, { ...accountsAdjustments });
    } else {
      console.log(
        'Updating income accounts in summary not possible: No accounts to update'
      );
    }
  }

  createJournalEntries() {
    const {
      transaction,
      saleAccountsMapping,
      userProfile,
      org: { orgId },
      accounts,
      transactionId,
      incomingSale,
    } = this;

    if (saleAccountsMapping) {
      const { newAccounts } = saleAccountsMapping;

      newAccounts.forEach(mappedAccount => {
        const { accountId, incoming } = mappedAccount;

        const incomeAccount = getAccountData(accountId, accounts);

        createEntry(transaction, userProfile, orgId, {
          account: incomeAccount,
          amount: incoming,
          reference: '',
          transactionId,
          transactionType: 'sales_receipt',
          transactionDetails: { ...incomingSale },
        });
      });
    } else {
      console.log('There are no Sale entries to create');
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
      console.log('There are no Sale entries to update');
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
      console.log('There are no Sale entries to delete');
    }
  }

  finalizeCreate() {
    this.createJournalEntries();
    this.updateAccountsInSummary();
  }

  finalizeUpdate() {
    const {
      createJournalEntries,
      updateJournalEntries,
      deleteJournalEntries,
      updateAccountsInSummary,
    } = this;

    createJournalEntries();
    updateJournalEntries();
    deleteJournalEntries();
    updateAccountsInSummary();
  }

  finalizeDelete() {
    this.deleteJournalEntries();
    this.updateAccountsInSummary();
  }
}
