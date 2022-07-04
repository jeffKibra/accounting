import { Account, Tax } from ".";

export interface Item {
  costPrice: number;
  createdAt: Date;
  createdBy: string;
  extraDetails: string;
  modifiedAt: Date;
  modifiedBy: string;
  name: string;
  salesAccountId: string;
  salesTaxId: string;
  salesTaxType: string;
  sellingPrice: number;
  sku: string;
  skuOption: string;
  status: string;
  type: string;
  unit: string;
  variant: string;
  salesTax: Tax;
  salesAccount: Account;
}
