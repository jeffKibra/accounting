import {
  Transaction,
  DocumentReference,
  DocumentData,
  doc,
  collection,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

import { getAccountData } from '../accounts';
import { db } from '../firebase';
import Summary from 'utils/summaries/summary';
import { JournalEntry } from 'utils/journals';
import formats from 'utils/formats';

import {
  Org,
  Account,
  CustomerOpeningBalanceTransactionType,
  CustomerOpeningBalance,
  CustomerOpeningBalanceForm,
} from 'types';

interface OpeningBalanceData {
  accounts: Account[];
  org: Org;
  openingBalanceId?: string;
  transactionType: keyof CustomerOpeningBalanceTransactionType;
  userId: string;
  customerId: string;
}

//------------------------------------------------------------------------------

export default class OpeningBalance {
  transaction: Transaction;
  docRef: DocumentReference<DocumentData>;
  customerId: string;
  userId: string;
  openingBalanceId: string;
  transactionType: keyof CustomerOpeningBalanceTransactionType;
  accounts: Account[];
  org: Org;
  /**
   * accounts_receivable account
   */
  ARAccount: Account;
  /**
   * opening_balance_adjustments account
   */
  OBAAccount: Account;

  constructor(transaction: Transaction, data: OpeningBalanceData) {
    const {
      accounts,
      org,
      openingBalanceId,
      transactionType,
      userId,
      customerId,
    } = data;
    const { orgId } = org;

    const OBCollection = collection(
      db,
      'organizations',
      orgId,
      'openingBalances'
    );

    const ref = openingBalanceId
      ? doc(OBCollection, openingBalanceId)
      : doc(OBCollection);

    this.transaction = transaction;
    this.accounts = accounts;
    this.org = org;
    this.openingBalanceId = ref.id;
    this.transactionType = transactionType;
    this.userId = userId;

    const ARAccount = getAccountData('accounts_receivable', accounts);
    const OBAAccount = getAccountData('opening_balance_adjustments', accounts);

    if (!ARAccount) {
      throw new Error('Accounts receivable account not found!');
    }
    if (!OBAAccount) {
      throw new Error('Opening balance adjustments account not found!');
    }

    this.ARAccount = ARAccount;
    this.OBAAccount = OBAAccount;

    this.customerId = customerId;
    this.docRef = ref;
  }

  async fetchCurrentOB() {
    const { transaction, docRef } = this;
    const snap = await transaction.get(docRef);
    const exists = snap.exists();
    if (!exists) {
      throw new Error('Could not find current customer opening balance');
    }

    const data = snap.data() as CustomerOpeningBalance;
    data.openingBalanceId = snap.id;

    return data;
  }

  create(data: CustomerOpeningBalanceForm) {
    const {
      transaction,
      org,
      customerId,
      ARAccount,
      OBAAccount,
      accounts,
      transactionType,
      docRef,
      userId,
    } = this;
    const { orgId } = org;
    /**
     * create transaction details for journal entries
     */
    const transactionDetails = {
      ...data,
      transactionId: docRef.id,
    };

    const { amount } = data;

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
      account: ARAccount,
      reference: '',
      transactionDetails,
      transactionId: customerId,
      transactionType: 'opening_balance',
    });
    summary.debitAccount(ARAccount.accountId, amount);
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

    transaction.set(this.docRef, {
      ...data,
      balance: data.amount,
      paymentsReceived: {},
      paymentsIds: [],
      paymentsCount: 0,
      status: 0,
      isSent: false,
      transactionType: transactionType,
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
      ARAccount,
      OBAAccount,
      customerId,
      org,
      userId,
      accounts,
    } = this;
    const { orgId } = org;

    const journalEntry = new JournalEntry(transaction, userId, orgId);

    /**
     * fetch data
     */
    const [currentOB, AREntry, OBAEntry] = await Promise.all([
      this.fetchCurrentOB(),
      JournalEntry.getAccountEntryForTransaction(
        orgId,
        ARAccount.accountId,
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
    const { amount: currentAmount } = currentOB;

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
    journalEntry.updateEntry(AREntry.entryId, {
      amount: 0 - amount,
      account: AREntry.account,
      credit: AREntry.credit,
      debit: AREntry.debit,
      entryId: AREntry.entryId,
    });
    summary.debitAccount(ARAccount.accountId, adjustment);
    /**
     * 2. credit opening_balance_adjustments entry for customer opening balance
     */
    journalEntry.updateEntry(OBAEntry.entryId, {
      amount,
      account: OBAEntry.account,
      credit: OBAEntry.credit,
      debit: OBAEntry.debit,
      entryId: OBAEntry.entryId,
    });
    summary.creditAccount(OBAAccount.accountId, adjustment);

    //update summaries
    summary.updateOrgSummary();
    summary.updateCustomerSummary(customerId);
    /**
     * update invoice
     */
    transaction.update(this.docRef, {
      amount,
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    });
  }
}
