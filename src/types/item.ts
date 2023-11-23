import { IAccountSummary, ITaxSummary } from '.';

export type ItemType = 'goods' | 'service' | 'vehicle';

export interface ItemFormData {
  name: string;
  salesAccount: IAccountSummary;
  rate: number;
  sku: string;
  // skuOption: string;
  type: ItemType;
  unit: string;
  // costPrice?: number;
  description?: string;
  salesTax?: ITaxSummary;
  pricesIncludeTax?: string;
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
