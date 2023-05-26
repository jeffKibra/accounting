import { Tax, VehicleFormData, Vehicle } from '.';

export interface SalesTax extends Tax {
  totalTax: number;
}

export interface SalesSummary {
  adjustment: number;
  shipping: number;
  subTotal: number;
  taxType: 'taxExclusive' | 'taxInclusive';
  totalAmount: number;
  totalTax: number;
  taxes: SalesTax[];
}

export interface SaleSummary {
  adjustment: number;
  shipping: number;
  subTotal: number;
  taxType: 'taxExclusive' | 'taxInclusive';
  totalAmount: number;
  totalTax: number;
  taxes: SalesTax[];
}

export interface SelectedItem extends VehicleFormData {
  vehicleId: string;
}

export interface SalesItem {
  item: SelectedItem;
  rate: number;
  quantity: number;
  salesTax: Tax | null;
  itemRate: number;
  itemTax: number;
  itemRateTotal: number;
  itemTaxTotal: number;
  startDate: Date | null;
  endDate: Date | null;
}

export interface ISaleVehicleFormData {
  item: Vehicle;
  rate: number;
  quantity: number;
  salesTax: Tax | null;
  startDate: Date | null;
  endDate: Date | null;
}

export interface SaleItem extends SalesItem {}

export interface GroupedItems {
  accountId: string;
  items: SalesItem[];
}

export interface SalesAccountSummary {
  accountId: string;
  salesAmount: number;
}
