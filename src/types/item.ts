import { Account, Tax } from ".";

export interface ItemFormData {
  costPrice: number;
  extraDetails: string;
  name: string;
  salesAccountId: string;
  salesAccount: Account;
  salesTaxId: string;
  salesTax: Tax;
  salesTaxType: string;
  sellingPrice: number;
  sku: string;
  skuOption: string;
  type: string;
  unit: string;
  variant: string;
}

interface Meta {
  status: string;
  createdAt: Date;
  createdBy: string;
  modifiedAt: Date;
  modifiedBy: string;
}

export interface ItemFromDb extends ItemFormData, Meta {}

export interface Item extends ItemFromDb {
  itemId: string;
}
