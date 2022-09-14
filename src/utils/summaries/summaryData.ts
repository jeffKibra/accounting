import { increment, FieldValue } from 'firebase/firestore';

import JournalEntry from '../journals/journalEntry';

import { Account, AccountType } from 'types';
interface AggregationData {
  [key: string]: number | FieldValue;
}

export default class SummaryData {
  data: AggregationData;
  accounts: Account[];

  constructor(accounts: Account[]) {
    this.data = {};
    this.accounts = accounts;
  }

  append(fieldName: string, incomingValue: number, currentValue?: number) {
    const prevValue = currentValue || 0;
    const adjustment = incomingValue - prevValue;

    this.data = {
      ...this.data,
      [fieldName]: increment(adjustment),
    };
  }

  appendObject(obj: { [key: string]: number | FieldValue }) {
    const { data } = this;
    if (data && typeof data === 'object') {
      this.data = { ...data, ...obj };
    } else {
      this.data = obj;
    }
  }

  appendPaymentMode(
    modeId: string,
    incomingValue: number,
    currentValue?: number
  ) {
    this.append(`paymentModes.${modeId}`, incomingValue, currentValue);
  }

  getAccountData(accountId: string) {
    const { accounts } = this;
    const account = accounts.find(account => account.accountId === accountId);

    if (!account) {
      throw new Error(`Account ${accountId} does not exist`);
    }

    return account;
  }

  appendAccount(
    accountId: string,
    incomingValue: number,
    currentValue: number = 0
  ) {
    this.append(`accounts.${accountId}`, incomingValue, currentValue);
  }

  appendAccountsObject(accounts: { [key: string]: number }) {
    Object.keys(accounts).forEach(accountId => {
      const amount = accounts[accountId];

      this.appendAccount(accountId, amount);
    });
  }

  creditAccount(accountId: string, amount: number) {
    const account = this.getAccountData(accountId);
    if (!account) {
      throw new Error(`Account ${accountId} does not exist`);
    }
    const creditAmount = SummaryData.createCreditAmount(
      account.accountType,
      amount
    );
    this.appendAccount(accountId, creditAmount);
  }

  debitAccount(accountId: string, amount: number) {
    const account = this.getAccountData(accountId);
    if (!account) {
      throw new Error(`Account ${accountId} does not exist`);
    }
    const debitAmount = SummaryData.createDebitAmount(
      account.accountType,
      amount
    );
    this.appendAccount(accountId, debitAmount);
  }

  //----------------------------------------------------------------
  //static methods
  //----------------------------------------------------------------

  static createCreditAmount(accountType: AccountType, amount: number) {
    if (amount < 0) {
      /**
       * debit account instead-assuption -user is updating an account
       * subtract amount from zero(0) to make positive
       */
      SummaryData.createDebitAmount(accountType, 0 - amount);
    }

    const { isCreditOnIncrease } = JournalEntry;

    return isCreditOnIncrease(accountType.main) ? amount : 0 - amount;
  }

  static createDebitAmount(accountType: AccountType, amount: number) {
    if (amount < 0) {
      /**
       * credit account instead-assuption -user is updating an account
       * subtract amount from zero(0) to make positive
       */
      SummaryData.createCreditAmount(accountType, 0 - amount);
    }

    const { isDebitOnIncrease } = JournalEntry;

    return isDebitOnIncrease(accountType.main) ? amount : 0 - amount;
  }
}
