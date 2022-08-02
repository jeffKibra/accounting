import { Account, Tax } from ".";

export interface ItemFormData {
  name: string;
  salesAccount: Account;
  sellingPrice: number;
  sku: string;
  skuOption: string;
  type: string;
  unit: string;
  costPrice?: number;
  extraDetails?: string;
  salesTax?: Tax;
  salesTaxType?: string;
  variant?: string;
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
