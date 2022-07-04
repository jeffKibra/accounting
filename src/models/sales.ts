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
  discountType: string;
  extraDetails: string;
  itemId: string;
  name: string;
  salesTaxType: string;
  sku: string;
  skuOption: string;
  type: string;
  unit: string;
  variant: string;
  sellingPrice: number;
  rate: number;
  itemRate: number;
  totalAmount: number;
  itemTax: number;
  totalTax: number;
  quantity: number;
  itemDiscount: number;
  discount: number;
  totalDiscount: number;
  costPrice: number;
  salesAccount: Account;
  salesTax: Tax | {};
}
