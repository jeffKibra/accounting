import { increment, FieldValue } from 'firebase/firestore';

import JournalEntry from '../journals/journalEntry';

import { Account } from 'types';
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
    return accounts.find(account => account.accountId === accountId);
  }

  appendAccount(
    accountId: string,
    incomingValue: number,
    currentValue?: number
  ) {
    const account = this.getAccountData(accountId);
    if (!account) {
      throw new Error(`Account data for ${accountId} does not exist`);
    }
    const current = JournalEntry.getRawAmount(account.accountType, {
      ...JournalEntry.createDebitAndCredit(account.accountType, current),
    });
    this.append(`accounts.${accountId}`, incomingValue, currentValue);
  }

  appendAccountsObject(accounts: { [key: string]: FieldValue }) {
    Object.keys(accounts).forEach(accountId => {
      this.data = {
        ...this.data,
        [`accounts.${accountId}`]: accounts[accountId],
      };
    });
  }
}
