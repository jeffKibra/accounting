import { Tax, Account } from ".";

export interface SalesTax extends Tax {
  totalTax: number;
}

export interface SalesSummary {
  adjustment: number;
  shipping: number;
  subTotal: number;
  taxType: string;
  totalAmount: number;
  totalTaxes: number;
  taxes: SalesTax[];
}

export interface SalesItem {
  itemId: string;
  name: string;
  variant?: string;
  salesAccount: Account;
  salesTax?: Tax;
  salesTaxType?: string;
  rate: number;
  quantity: number;
  itemRate: number;
  itemTax: number;
  itemRateTotal: number;
  itemTaxTotal: number;
}

export interface GroupedItems {
  accountId: string;
  items: SalesItem[];
}

export interface SalesAccountSummary {
  accountId: string;
  salesAmount: number;
}
