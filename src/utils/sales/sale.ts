import { Transaction } from 'firebase/firestore';
import { getAccountsMapping } from '../accounts';
import { getItemsAccounts } from '.';

import { SaleItem, AccountsMapping, SaleSummary } from 'types';

interface SaleObject {
  items: SaleItem[];
  summary: SaleSummary;
}

export default class Sale {
  protected transaction: Transaction;

  incomingSale: SaleObject;
  _currentSale: SaleObject | null;
  saleAccountsMapping: AccountsMapping | null;

  constructor(
    transaction: Transaction,
    items: SaleItem[],
    saleSummary: SaleSummary
  ) {
    this.transaction = transaction;
    this.incomingSale = {
      items,
      summary: saleSummary,
    };
    this.currentSale = null;
    this._currentSale = null;
    this.saleAccountsMapping = null;
  }

  set currentSale(sale: SaleObject | null) {
    let items = sale ? sale.items : [];
    const currentSummary = sale?.summary;
    const currentAccounts = sale
      ? [
          ...getItemsAccounts(items),
          {
            accountId: 'shipping_charge',
            amount: currentSummary?.shipping || 0,
          },
          {
            accountId: 'other_charges',
            amount: currentSummary?.adjustment || 0,
          },
          { accountId: 'tax_payable', amount: currentSummary?.totalTax || 0 },
          {
            accountId: 'accounts_receivable',
            amount: currentSummary?.totalAmount || 0,
          },
        ]
      : [];

    const incomingSummary = this.incomingSale.summary;
    const incomingAccounts = [
      ...getItemsAccounts(this.incomingSale.items),
      {
        accountId: 'shipping_charge',
        amount: incomingSummary.shipping || 0,
      },
      { accountId: 'other_charges', amount: incomingSummary.adjustment || 0 },
      { accountId: 'tax_payable', amount: incomingSummary.totalTax || 0 },
      { accountId: 'accounts_receivable', amount: incomingSummary.totalAmount },
    ];

    const accountsMapping = getAccountsMapping(
      currentAccounts,
      incomingAccounts
    );

    this._currentSale = sale;
    this.saleAccountsMapping = accountsMapping;
  }
}
