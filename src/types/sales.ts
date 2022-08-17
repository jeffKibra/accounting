import { Tax, ItemFormData } from '.';

export interface SalesTax extends Tax {
  totalTax: number;
}

export interface SalesSummary {
  adjustment: number;
  shipping: number;
  subTotal: number;
  taxType: string;
  totalAmount: number;
  totalTax: number;
  taxes: SalesTax[];
}

export interface SaleSummary {
  adjustment: number;
  shipping: number;
  subTotal: number;
  taxType: string;
  totalAmount: number;
  totalTax: number;
  taxes: SalesTax[];
}

export interface SelectedItem extends ItemFormData {
  itemId: string;
}

export interface SalesItem {
  item: SelectedItem;
  rate: number;
  quantity: number;
  salesTax?: Tax;
  itemRate: number;
  itemTax: number;
  itemRateTotal: number;
  itemTaxTotal: number;
}

export interface SaleItem {
  item: SelectedItem;
  rate: number;
  quantity: number;
  salesTax?: Tax;
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
