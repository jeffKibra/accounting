import {
  Transaction,
  serverTimestamp,
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';

import {
  EntryToCreate,
  AccountType,
  EntryToUpdate,
  Entry,
  TransactionTypes,
  MappedEntry,
  AccountMapping,
  GroupedEntries,
} from 'types';
import { db } from '../firebase';

import {
  ASSET,
  EQUITY,
  INCOME,
  EXPENSE,
  LIABILITY,
} from '../../constants/ledgers';

import { getDateDetails } from '../dates';

//----------------------------------------------------------------

export default class JournalEntry {
  transaction: Transaction;
  userId: string;
  orgId: string;

  constructor(transaction: Transaction, userId: string, orgId: string) {
    this.transaction = transaction;
    this.userId = userId;
    this.orgId = orgId;
  }

  createEntry(entry: EntryToCreate) {
    const {
      amount,
      account: { accountType },
    } = entry;
    const { orgId, userId, transaction } = this;
    /**
     * is the value +ve, -ve or zero(0)
     * to aid with querying
     */
    const amountState = JournalEntry.getAmountState(amount);
    /**
     * determine whether value is a debit or a credit
     */
    const { credit, debit } = JournalEntry.createDebitAndCredit(
      accountType,
      amount
    );
    /**
     * update entry
     */
    const entryRef = doc(collection(db, `organizations/${orgId}/journals`));
    const date = getDateDetails();

    transaction.set(entryRef, {
      ...entry,
      status: 'active',
      credit,
      debit,
      amountState,
      date,
      createdAt: serverTimestamp(),
      createdBy: userId,
      modifiedAt: serverTimestamp(),
      modifiedBy: userId,
    });
  }

  updateEntry(entryId: string, data: EntryToUpdate) {
    const {
      amount,
      account: { accountType },
    } = data;
    const { transaction, orgId, userId } = this;
    /**
     * is the value +ve, -ve or zero(0)
     * to aid with querying
     */
    const amountState = JournalEntry.getAmountState(amount);
    /**
     * determine whether value is a debit or a credit
     */
    const { credit, debit } = JournalEntry.createDebitAndCredit(
      accountType,
      amount
    );

    // console.log({ accountId, entryId });
    /**
     * update entry
     */
    const entryRef = doc(db, `organizations/${orgId}/journals/${entryId}`);

    transaction.update(entryRef, {
      ...data,
      credit,
      debit,
      amountState,
      modifiedAt: serverTimestamp(),
      modifiedBy: userId,
    });
  }

  deleteEntry(entryId: string, deletionType: 'delete' | 'mark' = 'delete') {
    const { transaction, orgId, userId } = this;

    const entryRef = doc(db, `organizations/${orgId}/journals/${entryId}`);

    if (deletionType === 'delete') {
      transaction.delete(entryRef);
    } else {
      transaction.update(entryRef, {
        status: 'deleted',
        modifiedAt: serverTimestamp(),
        modifiedBy: userId,
      });
    }
  }

  //----------------------------------------------------------------
  //static methods
  //----------------------------------------------------------------

  static async getAccountEntryForTransaction(
    orgId: string,
    accountId: string,
    transactionId: string,
    transactionType: keyof TransactionTypes,
    status = 'active'
  ): Promise<Entry> {
    console.log({ accountId, transactionId, transactionType, status, orgId });

    const q = query(
      collection(db, `organizations/${orgId}/journals`),
      orderBy('createdAt', 'desc'),
      where('account.accountId', '==', accountId),
      where('transactionId', '==', transactionId),
      where('transactionType', '==', transactionType),
      where('status', '==', status),
      limit(1)
    );

    const snap = await getDocs(q);
    if (snap.empty) {
      console.log('errors', {
        accountId,
        transactionId,
        transactionType,
        status,
        orgId,
      });

      throw new Error('Data inconsistencies detected!');
    }

    const entryDoc = snap.docs[0];
    const { credit, debit, account } = entryDoc.data();

    const entry = {
      debit,
      credit,
      account,
      entryId: entryDoc.id,
    };

    return entry;
  }

  static async getAccountsEntriesForTransaction(
    orgId: string,
    transactionId: string,
    transactionType: keyof TransactionTypes,
    incomeAccounts: AccountMapping[]
  ) {
    console.log({ incomeAccounts });

    const entries: MappedEntry[] = await Promise.all(
      incomeAccounts.map(async account => {
        const { accountId } = account;
        const entryData = await JournalEntry.getAccountEntryForTransaction(
          orgId,
          accountId,
          transactionId,
          transactionType
        );

        return {
          ...account,
          ...entryData,
        };
      })
    );

    return entries;
  }

  static async getTransactionEntries(
    orgId: string,
    transactionId: string,
    transactionType: keyof TransactionTypes
  ) {
    // console.log({ transactionId, orgId, transactionType });

    const q = query(
      collection(db, `organizations/${orgId}/journals`),
      orderBy('createdAt', 'desc'),
      where('transactionId', '==', transactionId),
      where('transactionType', '==', transactionType)
    );
    const snap = await getDocs(q);

    const entries: Entry[] = snap.docs.map(entryDoc => {
      const { credit, debit, account } = entryDoc.data();

      return {
        debit,
        credit,
        account,
        entryId: entryDoc.id,
      };
    });

    return entries;
  }

  groupEntriesBasedOnAccounts(entries: Entry[]) {
    return entries.reduce<GroupedEntries>((groupedEntries, entry) => {
      console.log({ groupedEntries });
      const {
        account: { accountId },
      } = entry;

      const group = groupedEntries[accountId];

      return {
        ...groupedEntries,
        [accountId]: group ? [...group, entry] : [entry],
      };
    }, {});
  }

  static isDebitOnIncrease(main: string) {
    return main === ASSET || main === EXPENSE;
  }

  static isCreditOnIncrease(main: string) {
    return main === LIABILITY || main === EQUITY || main === INCOME;
  }

  static verifyAccountId(accountId: string, entryAccountId: string) {
    if (accountId !== entryAccountId) {
      throw new Error(
        `All entries to for changing journal account must be of one account. Received entry accountId ${entryAccountId} instead of ${accountId}!`
      );
    }
  }

  static createDebitAndCredit(accountType: AccountType, amount: number) {
    const { main } = accountType;
    const { isCreditOnIncrease, isDebitOnIncrease } = JournalEntry;

    let credit = 0,
      debit = 0;

    if (amount !== 0) {
      if (isDebitOnIncrease(main)) {
        /**
         * if amount is +ve, debit it
         * else credit it (subtract from zero(0)) to make +ve
         */
        if (amount > 0) {
          debit = amount;
          credit = 0;
        } else {
          debit = 0;
          credit = 0 - amount;
        }
      } else if (isCreditOnIncrease(main)) {
        /**
         * if amount is +ve, credit it
         * else debit it (subtract from zero(0)) to make +ve
         */
        if (amount > 0) {
          credit = amount;
          debit = 0;
        } else {
          credit = 0;
          debit = 0 - amount;
        }
      }
    }

    return { credit, debit };
  }

  static createCredit(accountType: AccountType, amount: number) {
    const { main } = accountType;
    const { isCreditOnIncrease, isDebitOnIncrease } = JournalEntry;

    if (amount <= 0) {
      throw new Error('Value should be greater than zero(0)');
    }

    let credit = 0;

    if (isDebitOnIncrease(main)) {
      /**
       * value should be negative to credit it
       */
      credit = 0 - amount;
    } else if (isCreditOnIncrease(main)) {
      /**
       *value should be positive to credit it
       */
      credit = amount;
    }

    return credit;
  }

  static createDebit(accountType: AccountType, amount: number) {
    const { main } = accountType;
    const { isCreditOnIncrease, isDebitOnIncrease } = JournalEntry;

    if (amount <= 0) {
      throw new Error('Value should be greater than zero(0)');
    }

    let debit = 0;

    if (isDebitOnIncrease(main)) {
      /**
       * value should be positive to debit it
       */
      debit = amount;
    } else if (isCreditOnIncrease(main)) {
      /**
       *value should be negative to debit it
       */
      debit = 0 - amount;
    }

    return debit;
  }

  static getAmountState(amount: number) {
    /**
     * functions returns a string to represent the amount value
     * for easier querying of data
     */
    return amount === 0 ? 'zero' : amount > 0 ? 'positive' : 'negative';
  }

  static getRawAmount(accountType: AccountType, data: Entry) {
    const { main } = accountType;
    const { credit, debit } = data;
    const { isCreditOnIncrease, isDebitOnIncrease } = JournalEntry;

    let amount = 0;

    if (isDebitOnIncrease(main)) {
      /**
       * if debit is greater than zero(0)
       * amount is +ve,
       * else credit is greater than zero(0)
       * amount is -ve
       */
      if (debit > 0) {
        amount = debit;
      } else if (credit > 0) {
        amount = 0 - credit;
      }
    } else if (isCreditOnIncrease(main)) {
      /**
       * if credit is greater than zero(0)
       * amount is +ve,
       * else debit is greater than zero(0)
       * amount is -ve
       */
      if (credit > 0) {
        amount = credit;
      } else if (debit > 0) {
        amount = 0 - debit;
      }
    }

    return amount;
  }

  static verifyEntryData(data: Entry) {
    const { credit, debit, entryId } = data;

    if (debit > 0 && credit > 0) {
      throw new Error(`Entry data with id ${entryId} is not valid!`);
    }
  }
}
