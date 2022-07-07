import { Tax, Item, Account } from ".";

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

export interface SalesItemFromForm extends Omit<Partial<Item>, "salesTax"> {
  discountType?: string;
  itemId?: string;
  rate?: number;
  itemRate?: number;
  itemTax?: number;
  totalTax?: number;
  quantity?: number;
  itemDiscount?: number;
  discount?: number;
  totalDiscount?: number;
  salesTax?: Tax | {};
  salesTaxId?: string;
  salesAccountId: string;
  salesAccount: Account;
  totalAmount: number;
}

export interface SalesItem
  extends Omit<
    SalesItemFromForm,
    | "createdAt"
    | "createdBy"
    | "modifiedBy"
    | "modifiedAt"
    | "extraDetails"
    | "status"
    | "salesAccountId"
    | "salesTaxId"
  > {}
